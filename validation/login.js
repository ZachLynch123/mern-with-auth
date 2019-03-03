const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateLoginInput = data => {
    let errors = {};


    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // Email check
    if (validator.isEmpty(data.email)) {
        errors.email = "Email required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Invalid Email"
    }

    // check password
    if (validator.isEmpty(data.password)) {
        errors.password = "Paasword required"
    }

    // return object of results from check
    return {
        errors,
        isValid: isEmpty(errors)
    }
}