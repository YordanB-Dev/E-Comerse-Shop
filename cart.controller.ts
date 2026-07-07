import type { Request, Response, NextFunction } from "express";
import cartSerivce from "../services/cart.serivce.js";
import asyncHandler from "../middleware/asyncHandler.js";

interface authBody {
    userId: number,
    productId: number,
    quantity: number;
}

export const cartController = {


    getCart: asyncHandler(async(req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await cartSerivce.getCart(userId);
        return res.status(200).json(result);
    }),


    addItem: asyncHandler(async(req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const { productId, quantity } = req.body;
        const result = await cartSerivce.addItem(userId, productId, quantity);
        return res.status(201).json(result);
    }),

    removeItem: asyncHandler(async(req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const { productId, quantity } = req.body;
        const result = await cartSerivce.removeItem(userId, productId, quantity);
        return res.status(200).json(result);
    })
}

export default cartController