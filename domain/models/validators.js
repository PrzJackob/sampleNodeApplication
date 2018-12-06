module.exports.password = {
    validator: value => (value.length > 50 && /^\$2/.test(value)) || /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,}$/.test(value), // firstly if it has already hash them pass, if no then test it normal
    message: '{PATH} must have at least 6 characters and contain at least one letter and number.'
};