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
    confirmEmail: {
        type: Boolean,
    },
    gender: {
        type: String,
    }
    ,
    status: {
        type: String,
        enum: ['active', 'notActive']

    },
    role:{
        type:String,
        enum: ['admin', 'user']
    }
},
{
    timestamps: true
});

const userModel=model('User',userSchema);

export default userModel;