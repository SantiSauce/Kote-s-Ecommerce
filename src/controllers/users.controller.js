import dotenv from 'dotenv'
import { UserService } from "../repository/index.js";
import { createHash, validatePasswordToReset } from '../utils/utils.js';
import { isValidPassword } from '../utils/utils.js';
import { ERRORS_ENUM } from '../consts/ERRORS.js';
import { generateResetToken } from '../public/js/generateResetToken.js';
import CustomError from '../services/errors/customError.js';
import nodemailer from 'nodemailer'
import usersModel from '../dao/mongo/models/users.model.js';
import { extractCookie } from '../utils/utils.js';
dotenv.config()

export const getUsers = async() =>{
     await UserService.get()
}

/*export const getUserByEmail = async () => {
    await UserService.getByEmail(email)
}*/

/*export const getUserById = async () => {
    await UserService.getById(id)
}*/

export const logOutUser = async(req, res) => {
    await UserService.updateLastConnection(req.user.data._id)
    req.session.destroy((err) => {
        if (err) return res.status(500).render("errors", { error: err });
    
        res.clearCookie(process.env.COOKIE_NAME_JWT).redirect("/login");
})
}

export const getCurrentUser = async(req, res) => {
  
    try {
        const user = req.user.data
        const safeData = await UserService.getSafeInfo(user._id)
        res.send(safeData)
    } catch (error) {
        req.logger.error(error); 
    }
}

export const postRegister = async(req, res) => {
        res.redirect('/login')
}

export const postLogIn = async(req, res) => {
    if(!req.user.data) return res.status(400).send({status: 'error', error: 'Invalid credentials'})

    req.session.user = req.user.data
    await UserService.updateLastConnection(req.user.data._id)
    res.cookie(process.env.COOKIE_NAME_JWT, req.user.data.token).redirect('/home')

}

export const postGitHubCallBack = async(req, res) => {
    req.session.user.data = req.user.data

    res.cookie(process.env.COOKIE_NAME_JWT, req.user.data.token).redirect('/home')
}

export const resetPassword = async(req, res, next) => {

    try {
        const {password, email} = req.body    

        if(validatePasswordToReset(email, password)){
            const err = new CustomError({
                status: ERRORS_ENUM.INVALID_INPUT.status,
                code: ERRORS_ENUM.INVALID_INPUT.code,
                message: ERRORS_ENUM.INVALID_INPUT.message,
                details: 'Can not reset password with current password'
            })
            throw err
        }else{
            const newPassword = createHash(password)
            await UserService.resetPassword(user, newPassword)            
        }
        
    } catch (error) {
      req.logger.error(error); 
      next(error)
    }
}

export const changeUserRol = async(req, res, next) => {

  try {
    const uid = req.params.uid
    const user = await UserService.getById(uid)
    const requiredDocuments = ['Identificación', 'Comprobante_de_domicilio', 'Comprobante_de_estado_de_cuenta']

    const hasRequiredDocuments = user.documents && requiredDocuments.every(doc => user.documents.includes(doc))

    if(user.rol === 'admin') return res.json({status: 'Error', message: 'Admin can not change rol'})
    if(user.rol === 'premium') await UserService.changeUserRole(uid)

    if(hasRequiredDocuments){
      if(user.rol ==='user') await UserService.changeUserRole(uid)}
    else { 
      const err = new CustomError({
        status: ERRORS_ENUM.UNAUTHORIZED.status,
        code: ERRORS_ENUM.UNAUTHORIZED.code,
        message: ERRORS_ENUM.UNAUTHORIZED.message,
        details: 'Can not change role, missing documents'
    })
    throw err
   }
  } catch (error) {
    next(error)
  }
}

export const sendResetPasswordEmail = async(req, res, next) => {
    try {
      const { email } = req.body;
    //   const resetToken = generateResetToken(email)
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
        to: email,
        subject: 'Reset Password',
        html: `<p>Hola,</p>
      <p>Por favor haz clic en el siguiente botón para restablecer tu contraseña:</p>
      <p><a href=http://localhost:8082/resetPassword/${email}><button style="background-color: #4CAF50; color: white; padding: 12px 20px; border: none; cursor: pointer; border-radius: 4px;">Restablecer contraseña</button></a></p>`
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
    } catch (error) {
      req.logger.error(error);
      next(error);
    }
  };
  
export const uploadDocuments = async(req, res, next) => {

    try {
      const userId = req.params.uid;
      const files = req.files; 
  
    
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No se han proporcionado archivos' });
      }
  
      const user = await UserService.updateUserDocuments(userId, files)

      return res.json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error del servidor' });
    }

  }  

export const getAllUsers = async(req, res, next) => {

  try {
    const users = await UserService.getAll()
    res.send(users)
  } catch (error) { 
    req.logger(error)
  }
}

export const deleteAfterTwoDays = async(req, res, next) => {

  const inactiveUsers = await UserService.getInactiveUsers()

  if(inactiveUsers.length > 0){
    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: 'santiagosaucedo66@gmail.com',
        pass: 'grjesheoyudjczmt'
      }
    });



    inactiveUsers.forEach(async (user) => {
      try {

        await UserService.deleteUser(user._id)
  
        const mailOptions = {
          from: 'santiagosaucedo66@gmail.com', // Cambia por tu dirección de correo
          to: user.email,
          subject: 'Eliminación de cuenta por inactividad',
          text: 'Tu cuenta ha sido eliminada debido a la inactividad en los últimos 2 días.'
        };
  
        await transport.sendMail(mailOptions);
      } catch (error) {
          req.logger(error)       
      }
    });
  }
}

export const deleteUser = async(req, res, next) => {
  await UserService.deleteUser(req.params.uid)
}



