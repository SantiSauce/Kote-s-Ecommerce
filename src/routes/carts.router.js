import { Router } from 'express'
import {
    getCarts,
    getCartById,
    createCart,
    addProductToCart,
    deleteProductFromCart,
    deleteAllProductsFromCart,
    updateProductsFromCart,
    updateQuantity,
    generatePurchase,
    confirmCart
} from '../controllers/carts.controller.js'
import { reqAuth } from '../middlewares/auth.js'
import {auth} from '../middlewares/auth.js'

const router = Router()
    
    router.get('/', auth(['user', 'admin', 'premium']), getCarts)
    router.post('/', auth(['user', 'admin', 'premium']), createCart)
    router.post('/:cid/product/:pid', auth(['user', 'admin', 'premium']), addProductToCart)
    router.delete('/:cid/product/:pid', auth(['user', 'admin', 'premium']),deleteProductFromCart) 
    router.put('/:cid/product/:pid', auth(['user', 'admin', 'premium']), updateQuantity)
    router.delete('/:cid', auth(['user', 'admin', 'premium']),deleteAllProductsFromCart)
    router.post('/:cid', auth(['user', 'admin', 'premium']), updateProductsFromCart)
    router.post('/:cid/purchase',auth(['user', 'admin', 'premium']), generatePurchase)
    router.post('/:cid/confirmCart', auth(['user', 'admin', 'premium']), confirmCart)
        
export default router

