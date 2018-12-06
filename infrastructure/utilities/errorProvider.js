module.exports = {
    throwError: function (next, message, concrete, statusCode = 500, additionalData = new Map()) {
        const error = new Error(message);
        error.concrete = concrete;
        error.status = statusCode;

        if(additionalData.size !== 0) {
            for(let [key, value] of additionalData) {
                error[key] = value;
            }
        }
        
        next(error);
    }
};