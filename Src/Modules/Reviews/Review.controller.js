import orderModel from "../../../DB/Models/Order.model.js";
import { AppError } from "../../../GlobalError.js";

export const createReview = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.id;
    const { rating, comment } = req.body;
    const order = await orderModel.findOne({ userId, status: 'delivered', "products.productId": productId });
    if (!order) {
        return next(new AppError("can't review for this product", 404));
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/${productId}/reviews`
        })
    }
    req.body.image = { secure_url, public_id };
    const review = await reviewModel.create({ userId, productId, rating, comment, image: req.body.image });
    return next(new AppSuccess("success", 201, { review }));
}

