import couponModel from "../../../DB/Models/Coupon.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";

export const createCoupon = async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase();
    const coupon = await couponModel.findOne({ name: req.body.name });
    if (coupon) {
        return next(new AppError('Coupon already exists', 400));
    }
    req.body.expireDate = new Date(req.body.expireDate);
    req.body.createdBy = req.id;
    req.body.updatedBy = req.id;
    await couponModel.create(req.body);
    return next(new AppSuccess('success', 201));
}

export const getCoupons = async (req, res, next) => {
    const coupons = await couponModel.find().select("name");
    return next(new AppSuccess("success", 200, { coupons }));
}

export const getCouponById = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findById(id).populate([
        {
            path: 'createdBy',
            select: 'username'
        },
        {
            path: 'updatedBy',
            select: 'username'
        },
    ]);
    if (!coupon) {
        return next(new AppError("Invalid coupon", 404));
    }
    return next(new AppSuccess("success", 200, { coupon }));
}

export const deleteCoupon = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findByIdAndDelete(id).populate([
        {
            path: 'createdBy',
            select: 'username'
        },
        {
            path: 'updatedBy',
            select: 'username'
        },
    ]);
    if (!coupon) {
        return next(new AppError("Invalid coupon", 404));
    }
    return next(new AppSuccess('success', 200, { coupon }));
}

export const updateCoupon = async (req, res, next) => {
    const { id } = req.params;
    const { name, amount, expireDate } = req.body;
    const updatedBy = req.id;
    const coupon = await couponModel.findByIdAndUpdate(id, { name, amount, expireDate, updatedBy }, { new: true }).populate([
        {
            path: 'createdBy',
            select: 'username'
        },
        {
            path: 'updatedBy',
            select: 'username'
        },
    ]);
    if (!coupon) {
        return next(new AppError("Invalid coupon", 404));
    }
    return next(new AppSuccess('success', 200, { coupon }));
}