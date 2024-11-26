// message, status_code, error_code, error

class HttpException extends Error {
    message: string;
    statusCode: number;
    errorCode: number;
    error: any;

    constructor(message: string, statusCode: number, errorCode: number, error: any) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.error = error;
    }
}

export enum ErrorCode {
    USER_ALREADY_EXIST = 1001,
    USER_NOT_FOUND = 1002,
    INCORRECT_PASSWORD = 1003,
    ADDRESS_NOT_FOUND = 1004,
    ADDRESS_DOES_NOT_BELONG = 1005,
    UNPROCESSABLE_UNTITY = 2001,
    INTERNAL_EXCEPTION = 3001,
    UNAUTHORIZED = 4001,
    PRODUCT_NOT_FOUND = 5001,
    CART_NOT_FOUND = 6001,
    ORDER_NOT_FOUND = 7001,
}

export default HttpException;
