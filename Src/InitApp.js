import connectDb from "../DB/Connection.js";
import { AppError } from "../GlobalError.js";
import userRouter from "./Modules/Users/User.router.js";
import categoryRouter from "./Modules/Categories/Category.router.js"
import productRouter from "./Modules/Products/Product.router.js"
import cartRouter from "./Modules/Cart/Cart.router.js"
import authRouter from "./Modules/Auth/Auth.router.js";
import couponRouter from "./Modules/Coupon/Coupon.router.js";

const initApp = (app, express) => {
    connectDb();
    app.use(express.json());
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/categories', categoryRouter);
    app.use('/products', productRouter);
    app.use('/cart', cartRouter);
    app.use('/coupon',couponRouter)

    app.get('*', (req, res, next) => {
        return next(new AppError("page not found", 404));
    });
    app.use((success, req, res, next) => {
        return res.status(success.statusCode).json({ message: success.message, ...success.additionalData });
    });
    app.use((err, req, res, next) => {
        return res.status(err.statusCode).json({ message: err.message });
    });
}

export default initApp;