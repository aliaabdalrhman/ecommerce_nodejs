import Router from "express";
import * as couponComtroller from './Coupon.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Coupon.role.js";
import { createCouponSchema, deleteCouponSchema, getCouponByIdSchema, updateCouponSchema } from "./Coupon.validation.js";
import validation from "../../Middelware/Validation.js";

const router = Router();

router.post('/', validation(createCouponSchema),
    asyncHandler(auth(endPoints.create)),
    asyncHandler(couponComtroller.createCoupon));

router.get('/', asyncHandler(auth(endPoints.get)),
    asyncHandler(couponComtroller.getCoupons));

router.get('/:id', validation(getCouponByIdSchema),
    asyncHandler(auth(endPoints.get)),
    asyncHandler(couponComtroller.getCouponById));

router.delete('/:id', validation(deleteCouponSchema),
    asyncHandler(auth(endPoints.delete)),
    asyncHandler(couponComtroller.deleteCoupon));

router.put('/:id', validation(updateCouponSchema),
    asyncHandler(auth(endPoints.update)),
    asyncHandler(couponComtroller.updateCoupon));


export default router;
