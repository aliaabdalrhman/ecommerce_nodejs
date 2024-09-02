import userModel from "../../../DB/Models/User.model.js";
import { AppError } from "../../../GlobalError.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    const { username, email, password, cpassword } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return next(new AppError("Email already exists", 409));
    }
    else {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
        await userModel.create({ username, email, password: hashedPassword });
    }
    return res.status(201).json({ message: "success" });
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("Invalid email ", 401));
    }
    else {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return next(new AppError("Invalid password", 401));
        }
        else {
            const token = jwt.sign({ id: user._id }, process.env.LOGINSIGNATURE, { expiresIn: "1h" });
            return res.status(200).json({ message: "success", token });
        }
    }
};