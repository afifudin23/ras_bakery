import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions";

const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    const { message, statusCode, errorCode, error } = err;
    res.status(statusCode).json({
        message,
        errorCode,
        error,
    });
};
export default errorMiddleware;
