import HttpException from ".";

class BadRequestException extends HttpException {
    constructor(message: string, errorCode: number) {
        super(message, 400, errorCode, null);
    }
}

export default BadRequestException;
