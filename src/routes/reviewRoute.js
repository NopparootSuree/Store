const controller = require('../controllers/reviewController')
const router = require('express').Router()
const JWTMiddleware = require('../middlewares/jwt')

const jwtMiddleware = JWTMiddleware(process.env.JWT_SECRET_KEY);

router.post('/reviews', jwtMiddleware, controller.addReview)
router.get('/reviews', jwtMiddleware, controller.listReviews)
router.get('/review', jwtMiddleware, controller.getReview)
router.delete('/reviews/:id', jwtMiddleware, controller.deleteReview)
router.put('/reviews/:id', jwtMiddleware, controller.updateReview)

module.exports = router