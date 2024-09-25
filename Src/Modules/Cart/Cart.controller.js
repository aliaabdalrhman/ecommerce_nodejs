import cartModel from "../../../DB/Models/Cart.model.js";
import productModel from "../../../DB/Models/Product.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";


export const createCart = async (req, res, next) => {
    const userId = req.id;
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError("Invalid product", 404));
    }
    await cartModel.create({ userId, products: [{ productId }] });
    return next(new AppSuccess("success", 201));
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
        await cartModel.findOneAndUpdate({ userId },
            {
                $push: { products: { productId } }
            },
            { new: true });
        return next(new AppSuccess("success", 201));
    }
    else {
        return await createCart(req, res, next);
    }
}

export const removeItem = async (req, res, next) => {
    const userId = req.id;
    const { productId } = req.params;
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
    return next(new AppSuccess("success", 200));
}

export const clearCart = async (req, res, next) => {
    const userId = req.id;
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    if (cart.products.length === 0) {
        return next(new AppSuccess("Cart is already empty", 200));
    }
    await cartModel.findOneAndUpdate(
        { userId },
        { $set: { products: [] } },
        { new: true }
    );
    return next(new AppSuccess("success", 200));
}

export const getCart = async (req, res, next) => {
    const userId = req.id;
    const cart = await cartModel.findOne({ userId }).populate('products.productId');
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    return next(new AppSuccess("success", 200, { products: cart.products }));
}

export const increaseQty = async (req, res, next) => {
    const userId = req.id;
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError("Invalid product", 404));
    }
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    const productInCart = cart.products.find(p => p.productId.toString() === productId);
    if (!productInCart) {
        return next(new AppError("Product not found in cart", 404));
    }
    await cartModel.findOneAndUpdate(
        { userId, 'products.productId': productId },
        { $inc: { 'products.$.quantity': 1 } },
        { new: true }
    );
    return next(new AppSuccess("success", 200));
}

export const decreaseQty = async (req, res, next) => {
    const userId = req.id;
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError("Invalid product", 404));
    }
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    const productInCart = cart.products.find(p => p.productId.toString() === productId);
    if (!productInCart) {
        return next(new AppError("Product not found in cart", 404));
    }
    if (productInCart.quantity <= 1) {
        return next(new AppError("Quantity cannot be reduced below 1", 400));
    }
    await cartModel.findOneAndUpdate(
        { userId, 'products.productId': productId },
        { $inc: { 'products.$.quantity': -1 } },
        { new: true }
    );
    return next(new AppSuccess("success", 200));
}
