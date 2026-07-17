import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import productService from "../services/product.service.js";


export const productController = {
    getAll: asyncHandler(async(req: Request, res: Response) => {
        const result = await productService.getAll(req.query);
        return res.status(201).json(result);
    }),

    getById: asyncHandler(async(req: Request, res: Response) => {
        const id = Number(req.params.id);
        const result = await productService.getById(id);
        return res.status(201).json(result);
    }),

    create: asyncHandler(async(req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await productService.createProduct(req.body);
        return res.status(201).json(result);
    })
};

export default productController;
