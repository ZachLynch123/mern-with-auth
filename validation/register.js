const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateRegisterInput = data => {
    let errors = {};

    // converts empty fields to an empty string to use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : ""
    data.password2 = !isEmpty(data.password2) ? data.password2 : ""

    // name check
    if (validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
    // Email check
    if (validator.isEmpty(data.email)) {
        errors.name = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Invalid Email";
    }
    // Pass check
    if (validator.isEmpty(data.password)) {
        errors.name = "Password field is required";
    }
    // Pass2 check
    if (validator.isEmpty(data.password2)) {
        errors.name = "Confirm password required";
    }
    
    if (!validator.isLength(data.password, { min: 6, max: 30})) {
        errors.password = "Paasword must be more than 6 characters";
    }
    return {
        errors, 
        isValid: isEmpty(errors)
    };
};