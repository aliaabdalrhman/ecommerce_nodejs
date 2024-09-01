import { model, Schema } from "mongoose";


const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'notActive']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const categoryModel = model('Category', categorySchema);

export default categoryModel;