import jwt from 'jsonwebtoken'
import { AppError } from '../../GlobalError.js';
import userModel from '../../DB/Models/User.model.js';

export const roles={
    admin:'Admin',
    user:'User',
}

export const auth = (accessRole = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BERERTOKEN)) {
            return next(new AppError("Invalid authorization", 401));
        }
        const token = authorization.split(process.env.BERERTOKEN)[1];
        const decoded = jwt.verify(token, process.env.LOGINSIGNATURE);
        if (!decoded) {
            return next(new AppError("Invalid authorization", 401));
        }
        else {
            const user = await userModel.findById(decoded.id).select("id role");
            req.id = user.id;
            if (!accessRole.includes(user.role)) {
                return next(new AppError("Access denied", 403));
            };
            next();
        }
    }
}
