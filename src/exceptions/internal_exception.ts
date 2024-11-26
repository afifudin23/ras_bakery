import HttpException, { ErrorCode } from ".";

class InternalException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, error: any) {
        super(message, 500, errorCode, error);
    }
}

export default InternalException;

