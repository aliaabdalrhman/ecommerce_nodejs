import cartModel from "../../../DB/Models/Cart.model.js";
import productModel from "../../../DB/Models/Product.model.js";
import { AppError } from "../../../GlobalError.js";

export const createCart = async (req, res, next) => {
    const userId = req.id;
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError("Invalid product", 404));
    }
    const cart = await cartModel.create({ userId, products: [{ productId }] });
    return res.status(201).json({ message: "success", cart });
}

export const addToCart = async (req, res, next) => {
    const userId = req.id;
    const { productId } = req.body;
    const cart = await cartModel.findOne({ userId });
    if (cart) {
        const product = await productModel.findById(productId);
        if (!product) {
            return next(new AppError("Invalid product", 404));
        }
        const productExists = cart.products.some(product => product.productId.toString() === productId);
        if (productExists) {
            return next(new AppError("product already exists in cart", 400));
        }
        const newCart = await cartModel.findOneAndUpdate({ userId },
            {
                $push: { products: { productId } }
            },
            { new: true });
        return res.status(201).json({ message: "success", cart: newCart });
    }
    else {
        return await createCart(req, res, next);
    }
}

export const removeItem = async (req, res, next) => {
    const userId = req.id;
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError("Invalid product", 404));
    }
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    const productExists = cart.products.some(p => p.productId.toString() === productId);
    if (!productExists) {
        return next(new AppError("Product not found in cart", 404));
    }
    await cartModel.findOneAndUpdate(
        { userId },
        { $pull: { products: { productId } } },
        { new: true }
    );
    return res.status(200).json({ message: "success" });
}

export const clearCart = async (req, res, next) => {
    const userId = req.id;
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    if (cart.products.length === 0) {
        return res.status(200).json({ message: "Cart is already empty" });
    }
    await cartModel.findOneAndUpdate(
        { userId },
        { $set: { products: [] } },
        { new: true }
    );
    return res.status(200).json({ message: "success" });
}

export const getCart = async (req, res, next) => {
    const userId = req.id;
    const cart = await cartModel.findOne({ userId }).populate('products.productId');
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    return res.status(200).json({ message: "success", cart });
}

