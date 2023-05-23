import { Router } from "express";
import { showGeneratedProducts } from "./mocks.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router()

    router.get('/', auth(['admin']), showGeneratedProducts)      

export default router