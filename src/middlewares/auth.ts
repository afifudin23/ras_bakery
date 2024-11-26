import { NextFunction, Request, Response } from "express";
import UnauthorizedException from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "../keys";
import { prisma } from "..";
import { User } from "@prisma/client";

export interface AuthReq extends Request {
    user: User;
}

const authMiddleware: any = async (req: AuthReq, rses: Response, next: NextFunction) => {
    const token = req.headers.authorization!;
    if (!token) {
        return next(new UnauthorizedException("Unauthorized 1", ErrorCode.UNAUTHORIZED));
    }
    try {
        const payload: any = jwt.verify(token, JWT_TOKEN!);
        const user = await prisma.user.findFirst({
            where: {
                id: payload.id,
            },
        });
        if (!user) {
            return next(new UnauthorizedException("Unauthorized 2", ErrorCode.UNAUTHORIZED));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new UnauthorizedException("Unauthorized 3", ErrorCode.UNAUTHORIZED));
    }
};

export default authMiddleware;
