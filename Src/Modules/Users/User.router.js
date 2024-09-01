import { Router } from "express";
import * as userController from './User.controller.js'

const router = Router();

router.get('/', userController.getAllUsers);

export default router;