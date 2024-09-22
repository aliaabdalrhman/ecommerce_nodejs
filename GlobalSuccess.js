export class AppSuccess {
    constructor(message, statusCode, additionalData = {}) {
        this.message = message;
        this.statusCode = statusCode;
        this.additionalData = additionalData;
    }
}