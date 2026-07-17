import type { Request, Response, NextFunction } from "express";

const validateTask = (req: Request, res: Response, next: NextFunction): void => {
    const { name, price, stock } = req.body;

    if (!name || typeof name !== "string") {
        const err = new Error("Name is required") as Error & { status?: number };
        err.status = 400;
        return next(err);
    }

    if (!price || isNaN(Number(price))) {
        const err = new Error("Price is required") as Error & { status?: number };
        err.status = 400;
        return next(err);
    }

    next();
};

export default validateTask;
