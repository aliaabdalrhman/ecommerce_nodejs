import { Router } from "express";
import * as userController from './User.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./User.role.js";
import fileUpload, { fileType } from "../../Utilities/Multur.js";

const router = Router();

router.get('/', asyncHandler(auth(endPoints.getAllUsers)), asyncHandler(userController.getAllUsers));
router.get('/userData',asyncHandler(auth(endPoints.getUserData)),asyncHandler(userController.getUserData));
router.post('/Excel', fileUpload(fileType.excel).single('excel'),asyncHandler(userController.addUserExcel));

export default router;