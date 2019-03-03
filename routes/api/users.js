const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../model/User');

// @Route POST api/users/register
// @desc Register new user
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check the validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // make sure new registration is unique
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "There is an account registered with this email" });
            }
        });
    // Create new user if all is validated
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
        });

    // Hashing password before storing to database
    bcrypt.genSalt(10, (e, salt) => {
        bcrypt.hash(newUser.password, salt, (e, hash) => {
            if (e) throw e;
            newUser.password = hash;
            newUser
                .save()
                .then(user => res.json(user))
                .catch(e => console.log(e))
        })
    })
})