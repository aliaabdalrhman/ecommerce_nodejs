import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productName: {
            type: String,
        }
        ,
        productId: {
            type: Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        unitPrice: {
            type: Number,
            required: true
        },
        finalPrice: {
            type: Number,
            required: true
        }
    }],
    finalPrice: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['cash', 'cart'],
        default: 'cash'
    },
    couponId: {
        type: Types.ObjectId,
        ref: "Coupon"
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'delivered', 'cancelled', 'confirmed', 'onWay'],
    },
    notes: {
        type: String
    },
    rejectReson: {
        type: String
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const orderModel = model('Order', orderSchema);

export default orderModel;

