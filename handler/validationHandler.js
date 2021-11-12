const validationHandler = (e) => {
    const error = {};
    if (e.code == 11000) {
        error[Object.keys(e.keyValue)[0]] = `${
            e.keyValue[Object.keys(e.keyValue)[0]]
        } is already in use.`;
    }
    if (e.message.includes("validation failed")) {
        Object.values(e.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }
    return error;
};

module.exports = validationHandler;
