
import jwt from 'jsonwebtoken'
import { ERRORS_ENUM } from "../consts/ERRORS.js";
import CustomError from "../services/errors/customError.js";
import dotenv from 'dotenv'
dotenv.config()

export const reqAdmin = (req, res, next) => {
        if (req.user) {
            if(req.user.rol === 'admin')
            next();
          } else {
            const err = new CustomError({
                status: ERRORS_ENUM.FORBIDDEN.status,
                code: ERRORS_ENUM.FORBIDDEN.code,
                message: ERRORS_ENUM.FORBIDDEN.message,
                details: 'Access denied with user credentials'
            })
            throw err
            // res.status(403).send({error: 'Access denied'});
          } 
 }

export const reqAuth = (req, res, next) => {
    if(req.user) {
        next()
    } else{
        res.redirect('/login')
    }
}

export const reqPremium = (req, res, next) => {
    if(req.user && req.user.rol == 'premium'){
        next()
    }else{
        const err = new CustomError({
            status: ERRORS_ENUM.FORBIDDEN.status,
            code: ERRORS_ENUM.FORBIDDEN.code,
            message: ERRORS_ENUM.FORBIDDEN.message,
            details:'Action denied, only premium users'
        })
        throw err
    }
}




 export const auth = (...roles) => {
  return (req, res, next) => {
    let token = req.user ? (req.user.token !== undefined ? req.user.token : undefined) : undefined
    if (process.env.NODE_ENV === 'test') {
      if (!token) {
        req.user = null; // Establece el usuario en null para indicar que no hay autenticación
        return next();
      }
    }
    if(token === undefined){
      res.redirect('/login')
      return
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)

      if(roles.length === 0 && !roles.includes(decoded.user.rol)){
        const err = new CustomError({
          status: ERRORS_ENUM.FORBIDDEN.status,
          code: ERRORS_ENUM.FORBIDDEN.code,
          message: ERRORS_ENUM.FORBIDDEN.message,
          details:'Action denied, invalid credentials'
      })
      throw err
      }
      req.user = decoded.user
      next()
    } catch (error) {
      const err = new CustomError({
        status: ERRORS_ENUM.FORBIDDEN.status,
        code: ERRORS_ENUM.FORBIDDEN.code,
        message: ERRORS_ENUM.FORBIDDEN.message,
        details:'Invalid token'
    })
    throw err
    }
  }
 }