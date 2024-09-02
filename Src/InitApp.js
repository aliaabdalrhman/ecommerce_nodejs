import connectDb from "../DB/Connection.js";
import { AppError } from "../GlobalError.js";
import userRouter from "./Modules/Users/User.router.js";
import categoryRouter from "./Modules/Categories/Category.router.js"
import authRouter from "./Modules/Auth/Auth.router.js";

const initApp = (app, express) => {
    connectDb();
    app.use(express.json());
    app.use('/auth',authRouter);
    app.use('/users', userRouter);
    app.use('/categories', categoryRouter);
    app.get('*', (req, res, next) => {
        return next(new AppError("page not found", 404));
    });
    app.use((err, req, res, next) => {
        return res.status(err.statusCode).json({ message: err.message });
    });
}

export default initApp;