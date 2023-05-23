import Router from 'express'
import { testLoggers } from './logger.controller.js'
import { reqAdmin } from '../middlewares/auth.js'
import { reqAuth } from '../middlewares/auth.js'

const router = Router() 

router.get('/', [reqAdmin, reqAuth], testLoggers)

export default router