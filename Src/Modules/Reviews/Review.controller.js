import orderModel from "../../../DB/Models/Order.model.js";
import reviewModel from "../../../DB/Models/Reviews.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import cloudinary from "../../Utilities/Cloudinary.js";

export const createReview = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.id;
    const { rating, comment } = req.body;
    const order = await orderModel.findOne({ userId, status: 'delivered', "products.productId": productId });
    if (!order) {
        return next(new AppError("can't review for this product", 404));
    }
    const checkReview = await reviewModel.findOne({ userId, "products.productId": productId });
    if (checkReview) {
        return next(new AppError("You've already reviewed this product", 400));
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/reviews/${productId}`
        });
        req.body.image = { secure_url, public_id };
    }
    const review = await reviewModel.create({ userId, productId, rating, comment, image: req.body.image });
    return next(new AppSuccess("success", 201, { review }));
}

