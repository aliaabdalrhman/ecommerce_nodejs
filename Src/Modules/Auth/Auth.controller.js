import userModel from "../../../DB/Models/User.model.js";
import { AppError } from "../../../GlobalError.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { sendEmail } from "../../Utilities/SendEmail.js";

export const register = async (req, res, next) => {
    const { username, email, password, cpassword } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return next(new AppError("Email already exists", 409));
    }
    else {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Welcome Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    text-align: center;
                    padding: 20px 0;
                    background-color: #007bff;
                    color: #ffffff;
                    border-radius: 10px 10px 0 0;
                }
                .email-body {
                    padding: 20px;
                    color: #333333;
                    line-height: 1.6;
                    border:1px solid #007bff;
                    border-radius: 0px 0px 10px 10px;
                }
                .email-footer {
                    text-align: center;
                    padding: 10px;
                    color: #777777;
                    font-size: 12px;
                }
                .email-footer a {
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>
       <body>
    <div class="email-container">
        <div class="email-header">
            <h1>Welcome to Alia'a Store !</h1>
        </div>
        <div class="email-body">
            <p>Dear ${username},</p>
            <p>Thank you for joining Alia'a Store ! We’re excited to have you as part of our growing community. Now that you're a member, we hope you enjoy exploring our products and taking advantage of exclusive deals tailored just for you.</p>
            <p>If you ever have any questions or need support, don’t hesitate to get in touch with our team. We’re always here to help!</p>
            <p>Warm regards,<br>The Alia'a Store Support Team</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 Alia'a Store. All rights reserved.</p>
        </div>
    </div>
</body>

        </html>
    `;
        sendEmail(email, "Welcome to ecommerce", html);
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
            const token = jwt.sign({ id: user._id }, process.env.LOGINSIGNATURE, { expiresIn: "24h" });
            return res.status(200).json({ message: "success", token });
        }
    }
};