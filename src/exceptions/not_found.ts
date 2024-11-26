import HttpException, { ErrorCode } from ".";

class NotFoundException extends HttpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, 404, errorCode, null);
    }
}

export default NotFoundException;
