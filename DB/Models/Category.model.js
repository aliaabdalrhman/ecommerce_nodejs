// Import necessary functions and types from Mongoose
// Mongoose is a MongoDB object modeling tool that provides schema-based solutions to model data
import { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active'
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
    // Enable automatic creation of 'createdAt' and 'updatedAt' timestamp fields
    timestamps: true
});

// Create the Category model using the defined schema
// This model provides an interface for interacting with the 'Category' collection in the database
const categoryModel = model('Category', categorySchema);

export default categoryModel;