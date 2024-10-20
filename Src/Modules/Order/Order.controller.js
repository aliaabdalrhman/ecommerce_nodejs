import cartModel from "../../../DB/Models/Cart.model.js"
import couponModel from "../../../DB/Models/Coupon.model.js";
import orderModel from "../../../DB/Models/Order.model.js";
import productModel from "../../../DB/Models/Product.model.js";
import userModel from "../../../DB/Models/User.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import createInvoice from "../../Utilities/Pdf.js";


export const createOrder = async (req, res, next) => {
    const userId = req.id;
    const cart = await cartModel.findOne({ userId });
    if (!cart || !cart.products || cart.products.length === 0) {
        return next(new AppError("Cart is empty", 400));
    }
    const { couponName } = req.body;
    let products = cart.products;
    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName });
        if (!coupon) {
            return next(new AppError("Coupon not found", 404));
        }
        if (coupon.expireDate < new Date()) {
            return next(new AppError("coupon expired", 400));
        }
        if (coupon.usedBy.includes(userId)) {
            return next(new AppError("coupon already used", 409));
        }
        req.body.coupon = coupon;
    }
    let finalProductList = [];
    let FinalPrice = 0;
    for (let product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity }
        });
        if (!checkProduct) {
            return next(new AppError("Product quantity not available", 400));
        }
        product = product.toObject();
        product.productName = checkProduct.name;
        product.unitPrice = checkProduct.priceAfterDiscount;
        product.finalPrice = product.quantity * product.unitPrice;
        FinalPrice += product.finalPrice;
        finalProductList.push(product);
    }
    const user = await userModel.findById(userId);

    if (!req.body.address) {
        req.body.address = user.address;
    }
    if (!req.body.phone) {
        req.body.phone = user.phone;
    }

    const order = await orderModel.create({
        userId,
        products: finalProductList,
        finalPrice: FinalPrice - (FinalPrice * (req.body.coupon?.amount || 0) / 100),
        address: req.body.address,
        phone: req.body.phone,
        couponId: req.body.coupon?._id,
        notes: req.body.nots,
        updatedBy: userId
    });
    if (order) {

        const invoice = {
            shipping: {
                name: user.username,
                address: order.address,
                phoneNumber: order.phone
            },
            items: order.products,
            subtotal: order.finalPrice,
            invoice_nr: order._id
        };

        createInvoice(invoice, "invoice.pdf");
        for (const product of finalProductList) {
            await productModel.findOneAndUpdate({ _id: product.productId },
                {
                    $inc: {
                        stock: -product.quantity
                    }
                }, {
                new: true
            }
            )
        }
        if (req.body.coupon) {
            await couponModel.findOneAndUpdate({ _id: req.body.coupon._id },
                {
                    $addToSet: {
                        usedBy: userId
                    }
                })
        }
        await cartModel.updateOne({ userId },
            {
                $set: { products: [] }
            });

    }
    return next(new AppSuccess("success", 201, { order }))

}

export const getPendingOrders = async (req, res, next) => {
    const orders = await orderModel.find({ status: "pending" });
    return next(new AppSuccess("success", 200, { orders }))
}

export const changeStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findOne({ _id: orderId })
    if (!order || order.status == 'delivered') {
        return next(new AppError(`Order not found or has already been delivered`, 404));
    }

    const orderAfterUpdate = await orderModel.findOneAndUpdate({ _id: orderId },
        { status },
        { new: true }
    );

    const products = orderAfterUpdate.products;
    if (orderAfterUpdate.status === 'cancelled') {
        for (const product of products) {
            await productModel.findOneAndUpdate({ _id: product.productId },
                {
                    $inc: {
                        stock: product.quantity
                    }
                }, {
                new: true
            }
            )
        }
        if (orderAfterUpdate.couponId) {
            await couponModel.findOneAndUpdate(
                { _id: orderAfterUpdate.couponId },
                {
                    $pull: {
                        usedBy: orderAfterUpdate.userId
                    }
                }
            );
        }
    }
    return next(new AppSuccess("success", 200, { order: orderAfterUpdate }))
}

export const getConfirmedOrders = async (req, res, next) => {
    const orders = await orderModel.find({ status: "confirmed" });
    return next(new AppSuccess("success", 200, { orders }))
}

export const cancelOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.id;
    const { rejectReson } = req.body;
    const order = await orderModel.findOne({ _id: orderId });
    if (!order || order.status != 'pending') {
        return next(new AppError(`Order not found or cannot be canceled because it is not in pending status.`, 404));
    }
    const orderCancelled = await orderModel.findOneAndUpdate({ _id: orderId },
        { status: 'cancelled', rejectReson, updatedBy: userId },
        { new: true }
    );
    const products = orderCancelled.products;
    for (const product of products) {
        await productModel.findOneAndUpdate({ _id: product.productId },
            {
                $inc: {
                    stock: product.quantity
                }
            }, {
            new: true
        }
        )
    }
    if (orderCancelled.couponId) {
        await couponModel.findOneAndUpdate(
            { _id: orderCancelled.couponId },
            {
                $pull: {
                    usedBy: orderCancelled.userId
                }
            }
        );
    }
    return next(new AppSuccess("success", 200, { orderCancelled }))

}
