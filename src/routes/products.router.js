import { Router } from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct 
} from '../controllers/products.controller.js'
import {auth} from '../middlewares/auth.js'

const router = Router() 

    router.get('/', auth(['user', 'admin', 'premium']), getProducts) 
    router.post('/create', auth(['admin', 'premium']), createProduct)
    router.put('/:id', auth(['admin', 'premium']), updateProduct)
    router.delete('/:id', auth(['admin', 'premium']), deleteProduct)
    router.get('/:id', auth(['user', 'admin', 'premium']), getProductById)
    

export default router
    
