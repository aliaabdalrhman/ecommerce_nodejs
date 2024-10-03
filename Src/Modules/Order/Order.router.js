import Router from "express";
import * as orderController from './Order.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Order.role.js";

const router = Router();

router.post('/', asyncHandler(auth(endPoints.create)), asyncHandler(orderController.createOrder));
router.get('/pending', asyncHandler(auth(endPoints.changeState)), asyncHandler(orderController.getPendingOrders));
router.put('/changeStatus/:orderId', asyncHandler(auth(endPoints.changeState)), asyncHandler(orderController.changeStatus));
router.get('/confirmed', asyncHandler(auth(endPoints.delivery)), asyncHandler(orderController.getConfirmedOrders));
router.put('/cancelled/:orderId', asyncHandler(auth(endPoints.delete)), asyncHandler(orderController.cancelOrder));


export default router;