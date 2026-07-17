import type { Request, Response, NextFunction } from "express";
import orderService from "../services/order.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

 
export const orderController = {

    createOrder: asyncHandler(async(req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const {items} = req.body;
        const order = await orderService.createOrder({userId, items});
        return res.status(201).json(order);
    }),

    getOrdersByUser: asyncHandler(async(req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const order = await orderService.getOrdersByUser(userId);
        return res.status(201).json(order);
    }),

    getOrderById: asyncHandler(async(req: Request, res: Response) => {
        const orderId = Number(req.params.id);
        const userId = (req as any).user.id;
        const order = await orderService.getOrderById(orderId, userId);
        return res.status(201).json(order);
    })
};

export default orderController;
