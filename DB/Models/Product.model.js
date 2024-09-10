import { model, Schema, Types } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active'
    },
    mainImage: {
        type: Object,
        required: true,
    },
    subImages: {
        type: [Object],
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    priceAfterDiscount: {
        type: Number,
    },
    stock: {
        type: Number,
        required: true
    },
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategoryId: {
        type: Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    colors: {
        type: [String],
    },
    sizes: {
        type: [String],
        enum: ['xs', 's', 'm', 'l', 'xl'],
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,

    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    }

}, {
    timestamps: true
});

const productModel = model('Product', productSchema);

export default productModel;