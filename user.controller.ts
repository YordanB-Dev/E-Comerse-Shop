import type { Request, Response, NextFunction } from "express";
import userService from "../services/user.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

interface authBody {
    email: string,
    password: string,
    username: string;
}

const register = asyncHandler(async(req: Request, res: Response) => {
    const {email, password, username} = req.body as authBody;

    const result = await userService.register(email, password, username);

    return res.status(201).json(result);
});

const login = asyncHandler(async(req: Request, res: Response) => {
    const {email, password} = req.body as authBody;

    const user = await userService.login(email, password);

    return res.status(201).json(user);
});

export default {
    register,
    login
};
