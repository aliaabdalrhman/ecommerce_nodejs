import connectDb from "../DB/Connection.js";
import { AppError } from "../GlobalError.js";


const initApp = (app, express) => {
    connectDb();
    app.use(express.json());
    app.get('*', (req, res, next) => {
        return next(new AppError("page not found", 404));
    });
    app.use((err, req, res, next) => {
        return res.status(err.statusCode).json({ message: err.message });
    });
}

export default initApp;