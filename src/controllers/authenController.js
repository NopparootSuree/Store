const db = require('../models')
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { generateToken, comparePassword, setTimeExpired, hashPassword } = require('../config/authen')
require('dotenv').config();
const User = db.users


const register = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    const { username, password, email } = req.body
    const hashedPassword = await hashPassword(password)

    let arg = {
        username: username,
        password: hashedPassword,
        email: email
    }

    try {
        const product = await User.create(arg)
        res.status(200).json({message: "Created user successfully", result: product})

    } catch(error) {
        if(error.name === 'SequelizeUniqueConstraintError') {
            if(error.errors[0].message === 'users_username must be unique'){
                return res.status(400).json({error: "This username already exists." })
            } else if (error.errors[0].message === 'users_email must be unique') {
                return res.status(400).json({error: "This email already exists." })
            }
        } else {
            return res.status(500).json({error: "Internal Server Error" })
        }
    }
}

const login = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    const { username, password } = req.body;

    const user = await User.findOne({where: { username: username}})

    if (user != null) {
        let jsonPassword = JSON.stringify(user.password)
        const hashedPassword = jsonPassword.replace(/\"/g, "");
        const secretKey = process.env.JWT_SECRET_KEY;

        const isPasswordCorrect = await comparePassword(password, hashedPassword);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Login error, Invalid username and password.' });
        }

        let expiredIn =  setTimeExpired(1, "d")
        
        const claims = {
            username: user.username,
            algorithm: 'HS256',
        };

        const token = generateToken(claims, secretKey, expiredIn.stingTime);
        
        const payload = {
            token,
            username: user.username,
            issuedAt: new Date(),
            expiredAt: expiredIn.times,
        };
        
        res.status(200).json({ payload });
    } else {
        return res.status(404).json({ error: 'User is not found' });
    }

}

module.exports = {
    register,
    login
}