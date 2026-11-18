import type { Request, Response } from "express";
import userService from "./userService.js";
import asyncHandler from "../../asyncHandler.js";

interface authBody {
    email: string;
    password: string;
    username: string;
}

export const userController = {
    
    register: asyncHandler(async(req: Request, res: Response) => {
        const {email, password, username} = req.body as authBody;

        const result = await userService.register(email, password, username);

        return res.status(201).json(result);
    }),

    login: asyncHandler(async(req: Request, res: Response) => {
        const {email, password} = req.body as authBody;

        const user = await userService.login(email, password);

        return res.status(201).json(user);
    })
};

export default userController;
