import { Router } from "express";
import * as reviewController from './Review.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import fileUpload from "../../Utilities/Multur.js";
import { endPoints } from "./Review.role.js";

const router = Router({ mergeParams: true });

router.post('/', fileUpload().single('image'),
    asyncHandler(auth(endPoints.create)),
    asyncHandler(reviewController.createReview));


export default router;