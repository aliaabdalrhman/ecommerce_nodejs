import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    products: [{
        productId: {
            type: Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        },
    }],
}, {
    timestamps: true
}
);

const cartModel = model('Cart', cartSchema);

export default cartModel;