const controller = require('../controllers/userController')
const router = require('express').Router()
const JWTMiddleware = require('../middlewares/jwt')

const jwtMiddleware = JWTMiddleware(process.env.JWT_SECRET_KEY);

router.get('/users', jwtMiddleware, controller.listUsers)
router.get('/users/:id', jwtMiddleware, controller.getUser)
router.delete('/users/:id', jwtMiddleware, controller.deleteUser)
router.put('/users/:id', jwtMiddleware, controller.updateUser)

module.exports = router