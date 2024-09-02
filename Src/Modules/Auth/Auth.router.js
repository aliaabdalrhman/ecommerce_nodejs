import { Router } from "express";
import * as authController from './Auth.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { loginSchema, registerSchema } from "./Auth.validation.js";
import validation from "../../Middelware/Validation.js";

const router = Router();

router.post('/register', asyncHandler(validation(registerSchema)), asyncHandler(authController.register));
router.post('/login', asyncHandler(validation(loginSchema)), asyncHandler(authController.login));

export default router;