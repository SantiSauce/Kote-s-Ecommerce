import { Router } from 'express'
import { getCurrentUser } from '../controllers/users.controller.js'
import { authToken } from "../utils/utils.js";
import { reqAdmin } from '../middlewares/auth.js';
import {auth} from '../middlewares/auth.js'

const router = Router()

    router.get('/current', auth(['admin']),(req, res) => {

        const user = req.user.data

        res.json({status: 'User in session', payload: user})
        
    } )

export default router
