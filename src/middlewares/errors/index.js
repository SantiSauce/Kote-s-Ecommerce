import { ERRORS_ENUM } from "../../consts/ERRORS.js"
import CustomError from "../../services/errors/customError.js"

export const errorHandler = async (err, req, res, next) => {
    try {
        if(err instanceof CustomError){
            const {status, code, message, details} = err
            return res.status(400).json({error: message, status, code, details})
        }
        if(ERRORS_ENUM[err.code]){
            const {status, code, message} = ERRORS_ENUM[err.code]
            return res.status(400).json({error: message, status, code})
        }
        res.status(500).json({error: 'Unhandled error'})
        
    } catch (error) {
        next(error)
    }
}
