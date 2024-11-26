import { NextFunction, Request, Response } from "express";
import HttpException, { ErrorCode } from "./exceptions";
import InternalException from "./exceptions/internal_exception";
import { ZodError } from "zod";
import UnprocessableUntity from "./exceptions/validation";

const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (error) {
            let exception: HttpException;
            if (error instanceof HttpException) {
                exception = error;
            } else {
                if (error instanceof ZodError) {
                    exception = new UnprocessableUntity(
                        "Unprocessable Untity",
                        ErrorCode.UNPROCESSABLE_UNTITY,
                        error.issues
                    );
                } else {
                    exception = new InternalException("Something went wrong", ErrorCode.INTERNAL_EXCEPTION, error);
                }
            }
            next(exception);
        }
    };
};
export default errorHandler;
