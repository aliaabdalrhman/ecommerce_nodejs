import { object } from "joi";
import Schema, { model, Types } from "mongoose";

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    image: {
        type: object
    }
}, {
    timestamp: true
});

const reviewModel = model('Review', reviewSchema);

export default reviewModel;