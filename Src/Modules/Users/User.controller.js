import userModel from "../../../DB/Models/User.model.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import xlsx from "xlsx";

export const getAllUsers = async (req, res, next) => {
    const users = await userModel.find({ isDeleted: false }).select("-password");
    return next(new AppSuccess('success', 200, { users }));
}

export const getUserData = async (req, res, next) => {
    const userId = req.id;
    const user = await userModel.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return next(new AppSuccess('success', 200, { user }));
}

export const addUserExcel = async (req, res, next) => {
    const woorkBook = xlsx.readFile(req.file.path);
    const woorkSheet = woorkBook.Sheets[woorkBook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(woorkSheet);
    await userModel.insertMany(users);
    return next(new AppSuccess("success", 200));
}