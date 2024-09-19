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

