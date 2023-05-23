import { Router } from 'express'
import {auth} from '../middlewares/auth.js'
import {
    showAllProducts,
    showOneProduct, 
    getInsertProductView,
    showHomeView,
    getRegister,
    getLogIn,
    showAdminView,
    getCartView,
    showPurchasesView,
    resetPasswordView,
    getForgotPasswordView,
    getEditUsersView
} from '../controllers/views.controller.js'

const router = Router()
    router.get('/', (req, res) =>{
        res.redirect('/home')
    })
    router.get('/home', auth(['user', 'admin', 'premium']), showHomeView)
    router.get('/allProducts', auth(['user', 'admin', 'premium']), showAllProducts)
    router.get('/insertProduct', auth(['admin', 'premium']), getInsertProductView)
    router.get('/register', getRegister)
    router.get('/login',getLogIn)
    router.get('/admin', auth(['admin']), showAdminView)
    router.get('/cart/:cid', auth(['user', 'admin', 'premium']), getCartView)
    router.get('/products/:pid', auth(['user', 'admin', 'premium']),showOneProduct) 
    router.get('/purchases', auth(['user', 'admin', 'premium']),showPurchasesView) 
    router.get('/forgotPassword', auth(['user', 'admin', 'premium']), getForgotPasswordView)
    router.get('/resetPassword/:email', auth(['user', 'admin', 'premium']), resetPasswordView)
    router.get('/usersView', auth(['admin']), getEditUsersView)

export default router





