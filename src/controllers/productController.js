const db = require('../models')
const Joi = require('joi');
const Product = db.products

const addProduct = async (req, res ) => {
    const schema = Joi.object({
        product_id: Joi.string().pattern(new RegExp('^[A-Z][0-9]{4}$')).required(),
        name: Joi.string().min(0).max(100).required(),
        description: Joi.string().min(1).max(5000).required(),
        price: Joi.number().min(0).max(1000000).required(),
        published: Joi.boolean().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    try {
        const product = await Product.create({...req.body})
        res.status(200).json({message: "Created product successfully", result: product})

    } catch(error) {
        console.log(error);
        if(error.name === 'SequelizeUniqueConstraintError') {
            if(error.errors[0].message === 'products_name must be unique'){
                return res.status(400).json({error: "This product name already exists." })
            } else if (error.errors[0].message === 'PRIMARY must be unique') {
                return res.status(400).json({error: "This productID already exists." })
            } 
        } else {
            return res.status(500).json({error: "Internal Server Error" })
        }
    }
}

const listProducts = async (req, res) => {
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

    let products = await  Product.findAll({ where: {}, offset: arg.offset, limit: arg.limit})
    if (products.length == 0) {
        return res.status(200).json({result: "No product"})
    }
    res.status(200).json(products)
}

const getProduct = async (req, res) => {
    const { id } = req.params
    let product = await Product.findByPk(id)

    if (product == null) {
        return res.status(200).json({result: "No product"})
    }
    res.status(200).json({result: product})
}

const deleteProduct = async (req, res) => {
    const { id } = req.params

    let product = await Product.destroy({
        where: {
            product_id: id
        }
    })

    if (product == 0) {
        return res.status(200).json({result: "No product"})
    }

    res.status(200).json({message: "Deleted Product successfully"})
}

const updateProduct = async (req, res) => {
    const { id } = req.params
    const schema = Joi.object({
        name: Joi.string().min(0).max(100).required(),
        description: Joi.string().min(1).max(5000).required(),
        price: Joi.number().min(0).max(9).required(),
        published: Joi.boolean().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({succuss: false, error: error.details[0].message});
    }

    try {
        let product = await Product.update({...req.body}, {
            where: {
                product_id: id
            }
        })

        if (product == 0) {
            return res.status(200).json({result: "No product"})
        }
    
        res.status(200).json({message: "Updated Product successfully"})
    } catch (error) {
        if(error.name === 'SequelizeUniqueConstraintError') {
            if(error.errors[0].message === 'products_name must be unique'){
                return res.status(400).json({error: "This product name already exists." })
            } 
        } else {
            return res.status(500).json({error: "Internal Server Error" })
        }
    }
}

module.exports = {
    addProduct,
    listProducts,
    getProduct,
    deleteProduct,
    updateProduct
}