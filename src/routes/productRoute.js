const controller = require('../controllers/productController')
const router = require('express').Router()
const JWTMiddleware = require('../middlewares/jwt')

const jwtMiddleware = JWTMiddleware(process.env.JWT_SECRET_KEY);

router.post('/products', jwtMiddleware, controller.addProduct)
router.get('/products', jwtMiddleware, controller.listProducts)
router.get('/products/:id', jwtMiddleware, controller.getProduct)
router.delete('/products/:id', jwtMiddleware, controller.deleteProduct)
router.put('/products/:id', jwtMiddleware, controller.updateProduct)

module.exports = router