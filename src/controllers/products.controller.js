import { ProductService } from "../repository/index.js";

import CustomError from "../services/errors/CustomError.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import { ERRORS_ENUM } from "../consts/ERRORS.js";
import nodemailer from 'nodemailer'


export const createProduct =  async (req, res, next) => {

    try {        
        const user = req.user
        req.body.owner = (!user) ? 'admin' : user.email
        const product = req.body

        // const product = req.body

        if((!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category)){
            console.log('llegue hasta custom error');
            const err = new CustomError({
                status: ERRORS_ENUM.INVALID_INPUT.status,
                code: ERRORS_ENUM.INVALID_INPUT.code,
                message: ERRORS_ENUM.INVALID_INPUT.message,
                details: generateProductErrorInfo(product)
            })
            throw err
        }
        const valide = await ProductService.verifyCode(product.code)
        console.log(valide);
        if( valide === false){
             const prodocutInserted = await ProductService.create(product)
            res.json(`Product ${product.title} successfully created`)
    
        }else{
            res.status(400).json({message: 'code already exists', status: 400})
            console.log('code already exists');
        }
  
    }catch (error) {
        console.log(error);
        req.logger.error(error); 
        next(error)
    }
}

export const getProducts = async (req, res, mext) => {
    try {
        const limit = req.query?.limit || 10
        const page = req.query?.page || 1
        const filter = req.query?.query || ''
        //const sort = req.params?.sort
    
        const search = {}
        if(filter) search['category'] = {$regex:filter}
    
        const options = {page, limit, lean:true}
    
        let products = []
    
        if(filter == 'stock'){
            products = await ProductService.getPaginate({stock:0}, options)
        }
        if(filter !== 'stock'){
            products = await ProductService.getPaginate(search, options)
        } 
    
        if(!products){
            const err = new CustomError({
                status: ERRORS_ENUM.NOT_FOUND.status,
                code: ERRORS_ENUM.NOT_FOUND.code,
                message: ERRORS_ENUM.NOT_FOUND.message,
                details: 'Not products found with criteria'
            })
            throw err
        }
    
        products.prevLink = (products.hasPrevPage) ? `/?page=${products.prevPage}` : '' 
        products.nextLink = (products.hasNextPage) ? `/?page=${products.nextPage}` : '' 
    
        const result = {
            status: 'success', 
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        }
        res.json(result) 
        
    } catch (error) {
        req.logger.error(error);
        next(error)
    }

}

export const getProductById = async (req, res, next) => {
    try {
        const product = await ProductService.getOne(req.params.id)
        if(!product){
            const err = new CustomError({
                status: ERRORS_ENUM.NOT_FOUND.status,
                code: ERRORS_ENUM.NOT_FOUND.code,
                message: ERRORS_ENUM.NOT_FOUND.message,
                details: 'Not product found'
            })
            throw err
        }
        res.json(product)
        
    } catch (error) {
        req.logger.error(error); 
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const user = req.user.data
        const product = req.params.id
        console.log({user,product});
        if(product.owner === user.email || user.rol ==='admin'){ //puedo hacer delete
            await ProductService.delete(product)
            if(product.owner !== 'admin'){// que el campo owner tiene email -> mando aviso de delete a email
                // const productUser = 
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    port: 587,
                    auth: {
                      user: 'santiagosaucedo66@gmail.com',
                      pass: 'grjesheoyudjczmt'
                    }
                  });
                  const mailOptions = {
                    from: 'santiagosaucedo66@gmail.com',
                    to: user.email,
                    subject: 'Reset Password',
                    html: `<p>Aviso</p>
                  <p>El producto ${product.title} ha sido eliminado del sitio</p>`
                  };
                  transport.sendMail(mailOptions, function(error, info){
                    if (error) {
                      const err = new CustomError({
                        status: ERRORS_ENUM.INTERNAL_SERVER_ERROR.status,
                        code: ERRORS_ENUM.INTERNAL_SERVER_ERROR.code,
                        message: ERRORS_ENUM.INTERNAL_SERVER_ERROR.message,
                        details: 'Error: email not sent'
                      });
                      req.logger.error(error);
                      next(err);
                    } else {
                      req.logger.debug('Correo electrónico enviado: ' + info.response);
                      res.status(200).json({ message: 'Email enviado exitosamente' });
                    }
                  });
            }
            res.json(await ProductService.get())
        }else{
            const err = new CustomError({
                status: ERRORS_ENUM.FORBIDDEN.status,
                code: ERRORS_ENUM.FORBIDDEN.code,
                message: ERRORS_ENUM.FORBIDDEN.message,
                details: 'Only products you created are allowed to be deleted'
            })
            throw err
        }        
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res) => {
    const productUpdated = await ProductService.update(req.params.id, req.body)
    res.json(productUpdated)
}

