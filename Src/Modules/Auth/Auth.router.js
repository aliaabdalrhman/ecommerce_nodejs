import { Router } from "express";
import * as authController from './Auth.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { forgotPasswordSchema, loginSchema, registerSchema, sendCodeSchema } from "./Auth.validation.js";
import validation from "../../Middelware/Validation.js";

const router = Router();

router.post('/register', asyncHandler(validation(registerSchema)), asyncHandler(authController.register));
router.post('/login', asyncHandler(validation(loginSchema)), asyncHandler(authController.login));
router.put('/sendCode', asyncHandler(validation(sendCodeSchema)), asyncHandler(authController.sendCode));
router.put('/forgotPassword', asyncHandler(validation(forgotPasswordSchema)), asyncHandler(authController.forgotPassword));

export default router;