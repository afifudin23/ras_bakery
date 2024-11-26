import HttpException, { ErrorCode } from ".";

class UnprocessableUntity extends HttpException {
    constructor(message: string, errorCode: ErrorCode, error: any) {
        super(message, 422, errorCode, error);
    }
}
export default UnprocessableUntity;
