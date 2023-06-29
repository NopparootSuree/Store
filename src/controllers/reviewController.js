const db = require('../models')
const Joi = require('joi');
const Review = db.reviews

const addReview = async (req, res ) => {
    const schema = Joi.object({
        comment: Joi.string().max(5000).required(),
        user_id: Joi.string().min(36).max(36).required(),
        product_id: Joi.string().pattern(new RegExp('^[A-Z][0-9]{4}$')).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    try {
        const review = await Review.create({...req.body})
        res.status(200).json({message: "Created review successfully", result: review})

    } catch(error) {
        if(error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({error: "Foreign key constraint violation"})
        }  else {
            return res.status(500).json({error: "Internal Server Error" })
        }
    }
}

const listReviews = async (req, res) => {
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

    let reviews = await Review.findAll({ where: {}, offset: arg.offset, limit: arg.limit})
    if (reviews.length == 0) {
        return res.status(200).json({result: "No Review"})
    }
    res.status(200).json(reviews)
}

const getReview = async (req, res) => {
    const schemaUID = Joi.object({
        uid: Joi.string().min(36).max(36).required(),
    });

    const { errorUID } = schemaUID.validate(req.query.uid);
    if (errorUID) {
        return res.status(400).json({error: error.details[0].message});
    }

    const schemaPID = Joi.object({
        pid: Joi.string().pattern(new RegExp('^[A-Z][0-9]{4}$')).required(),
    });

    const { errorPID } = schemaPID.validate(req.query.pid);
    if (errorPID) {
        return res.status(400).json({error: error.details[0].message});
    }

    let { uid, pid } = req.query

    try {
        if(uid != null && pid == null) {
            let review = await Review.findAll({where: {user_id: uid}})
    
            if (review.length == 0) {
                return res.status(200).json({result: "This user has not commented."})
            }
            res.status(200).json({result: review})
        } else if (pid != null & uid == null) {
            let review = await Review.findAll({where: {product_id: pid}})
    
            if (review.length == 0) {
                return res.status(200).json({result: "There are no reviews for this product."})
            }
            res.status(200).json({result: review})
        } else if (uid != null && pid != null) {
            let review = await Review.findAll({
                where: {
                    user_id: uid,
                    product_id: pid,
              }
            })
    
            if (review.length == 0) {
                return res.status(200).json({result: "No Review"})
            }
            res.status(200).json({result: review})
        } else if (uid == null && pid == null) {
            return res.status(404).json({result: "Bad request"})
        } else {
            return res.status(500).json({error: "Internal Server Error" })
        }
    } catch(error) {
        console.log(error);
        if(error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({error: "Internal Server Error"})
        }
    }
    
}

const deleteReview = async (req, res) => {
    const { id } = req.params

    let review = await Review.destroy({
        where: {
            id: id
        }
    })

    if (review == 0) {
        return res.status(200).json({result: "No Review"})
    }

    res.status(200).json({message: "Deleted Review successfully"})
}

const updateReview = async (req, res) => {
    const { id } = req.params
    const schema = Joi.object({
        comment: Joi.string().max(5000).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({error: error.details[0].message});
    }

    try {
        let review = await Review.update({...req.body}, {
            where: {
                id: id
            }
        })

        if (review == 0) {
            return res.status(200).json({result: "No Review"})
        }
    
        res.status(200).json({message: "Updated Review successfully"})

    } catch (error) {
        return res.status(500).json({error: "Internal Server Error" })
    }
}

module.exports = {
    addReview,
    listReviews,
    getReview,
    deleteReview,
    updateReview
}