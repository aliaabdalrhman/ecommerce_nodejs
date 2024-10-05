import userModel from "../../../DB/Models/User.model.js";
import { AppError } from "../../../GlobalError.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { sendEmail } from "../../Utilities/SendEmail.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import { nanoid } from 'nanoid'
import { customAlphabet } from 'nanoid/non-secure'

export const register = async (req, res, next) => {
    const { username, email, password, cpassword } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return next(new AppError("Email already exists", 409));
    }
    else {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
        const token = jwt.sign({ email }, process.env.LOGINSIGNATURE, { expiresIn: '24h' });
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
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
                    border: 1px solid #007bff;
                    border-radius: 0 0 10px 10px;
                }
                .email-body p {
                    margin: 10px 0;
                }
                .email-body a {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: bold;
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
                    <h1>Welcome to Alia'a Store!</h1>
                </div>
                <div class="email-body">
                    <p>Dear ${username},</p>
                    <p>Thank you for joining <strong>Alia'a Store</strong>! We’re thrilled to have you as part of our growing community. Now that you're a member, we hope you enjoy discovering our products and benefiting from exclusive offers just for you.</p>
                    <p>If you ever need assistance or have any questions, feel free to reach out to our support team. We're always here to help!</p>
                    <p><a href="${process.env.URL}/auth/confirmEmail/${token}">Please confirm your email</a></p>
                    <p>Warm regards,<br><strong>The Alia'a Store Support Team</strong></p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 Alia'a Store. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

        sendEmail(email, "Welcome to ecommerce ... confirm email", html);
        await userModel.create({ username, email, password: hashedPassword });
    }
    return next(new AppSuccess("success", 201));
}

export const confirmEmail = async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.LOGINSIGNATURE);
    await userModel.findOneAndUpdate({ email: decoded.email }, { confirmEmail: true });
    return next(new AppSuccess("success", 200));
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("Invalid email", 401));
    }
    else {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return next(new AppError("Invalid password", 401));
        }
        else {
            const token = jwt.sign({ id: user._id }, process.env.LOGINSIGNATURE, { expiresIn: "24h" });
            return next(new AppSuccess("success", 200, { token }));
        }
    }
};

export const sendCode = async (req, res, next) => {
    const { email } = req.body;
    const code = customAlphabet('1234567890abcdefABCDEF', 6)();
    const user = await userModel.findOneAndUpdate({ email }, { sendCode: code }, { new: true });
    if (!user) {
        return next(new AppError("Invalid email", 401));
    }
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Password Reset Code</title>
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
            .code-box {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
                text-align: center;
                background-color: #f9f9f9;
                padding: 10px;
                border: 1px dashed #007bff;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
    <div class="email-container">
        <div class="email-header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="email-body">
            <p>We received a request to reset your password for your Alia'a Store account. Use the code below to reset your password:</p>
            <div class="code-box">${code}</div>
            <p>If you didn’t request this, please ignore this email or contact our support team.</p>
            <p>Best regards,<br>The Alia'a Store Support Team</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 Alia'a Store. All rights reserved.</p>
        </div>
    </div>
    </body>
    </html>
`;
    sendEmail(email, 'reset password', html);
    return next(new AppSuccess("success", 200));
}

export const forgotPassword = async (req, res, next) => {
    const { email, password, code } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("Invalid email", 401));
    }
    if (user.sendCode != code) {
        return next(new AppError("Invalid code", 401));
    }
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
    user.password = hashedPassword;
    user.sendCode = null;
    user.save();
    return next(new AppSuccess("success", 200));
}

