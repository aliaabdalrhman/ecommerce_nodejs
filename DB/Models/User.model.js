import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    phone: {
        type: Number,
    },
    address: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    confirmEmail: {
        type: Boolean,
    },
    gender: {
        type: String,
    }
    ,
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active'

    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    sendCode: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    });

const userModel = model('User', userSchema);

export default userModel;