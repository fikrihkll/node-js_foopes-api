const normalResponse = (status, message, data) => {
    return {
        status: status,
        message: message,
        data: data
    };
}

const internalErrorResponse = (err) => {
    return {
        message: `ups... there might be a cute bug right there...\n${err}`
    };
}

module.exports = {
    normalResponse,
    internalErrorResponse
}