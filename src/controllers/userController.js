const db = require('../models')
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { hashPassword } = require('../config/authen')
const User = db.users


const listUsers = async (req, res) => {
    const schema = Joi.object({
        pageID: Joi.number().min(1).required(),
        pageSize: Joi.number().min(1).required(),
    });

    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    let { pageID, pageSize } = req.query

    let arg = {
        limit: parseInt(pageSize),
        offset: (parseInt(pageID) - 1) * parseInt(pageSize)
    }
    
    let users = await User.findAll({where: {}, offset: arg.offset, limit: arg.limit, attributes: ['user_id', 'username', 'email', 'createdAt', 'updatedAt']})
    if (users.length == 0) {
        return res.status(200).json({result: "No User"})
    }
    res.status(200).json(users)
}

const getUser = async (req, res) => {
    const { id } = req.params
    let user = await User.findOne({where: { user_id: id}, attributes: ['user_id', 'username', 'email', 'createdAt', 'updatedAt']})

    if (user == null) {
        return res.status(200).json({result: "No User"})
    }
    res.status(200).json({result: user})
}

const deleteUser = async (req, res) => {
    const { id } = req.params

    let user = await User.destroy({
        where: {
            user_id: id
        }
    })

    if (user == 0) {
        return res.status(200).json({result: "No User"})
    }

    res.status(200).json({message: "Deleted User successfully"})
}

const updateUser = async (req, res) => {
    const { id } = req.params
    const schema = Joi.object({
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,}$')).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({succuss: false, error: error.details[0].message});
    }

    const { password } = req.body
    const hashedPassword = await hashPassword(password)

    try {
        let user = await User.update({password: hashedPassword}, {
            where: {
                user_id: id
            }
        })

        if (user == 0) {
            return res.status(200).json({result: "No User"})
        }
    
        res.status(200).json({message: "Updated User successfully"})
    } catch (error) {
        if(error.name === 'SequelizeUniqueConstraintError') {
            if(error.errors[0].message === 'users_email must be unique'){
                return res.status(400).json({error: "This email already exists." })
            } 
        } else {
            return res.status(500).json({error: "Internal Server Error" })
        }
    }
}

module.exports = {
    listUsers,
    getUser,
    deleteUser,
    updateUser
}