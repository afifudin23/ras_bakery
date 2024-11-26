import { NextFunction, Response } from "express";
import { AuthReq } from "../middlewares/auth";
import UnauthorizedException from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions";

const adminMiddleware = (req: AuthReq, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user.role !== "ADMIN") {
        return next(new UnauthorizedException("Unauthorization Admin", ErrorCode.UNAUTHORIZED));
    }
    next();
};

export default adminMiddleware;
