import CustomError from "../services/errors/customError.js"
import { generateProduct } from "../utils/products.mock.js"
import { ERRORS_ENUM } from "../consts/ERRORS.js"

export const showGeneratedProducts = (req, res) => {
    let numOfProducts = 100
    let products = []
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct())        
    }
    if(!products[1].nombrre){
        const err = new CustomError({
            status: ERRORS_ENUM.NOT_FOUND.status,
            code: ERRORS_ENUM.NOT_FOUND.code,
            message: ERRORS_ENUM.NOT_FOUND.message,
            details: 'Unable to find mocks'
        })
        throw err
    }
    res.json({status: 'success', payload:products})
}