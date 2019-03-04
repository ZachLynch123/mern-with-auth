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

// @Route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {
    // Validation

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        // check if user exists
        if(!user) {
            return res.status(400).json({ emailNotFound: "email not found"});
        }
        // Check password

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                // Sign token

                jwt.sign (
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 
                    },
                    (e, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );

            } else {
                return res.status(400).json({ passwordIncorrect: "Password Incorrect. Try again" });
            }
        })
    })

})

module.exports = router;