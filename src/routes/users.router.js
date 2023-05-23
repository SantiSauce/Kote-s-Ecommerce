import { Router } from 'express'
import {
    logOutUser,
    postRegister,
    postLogIn,
    postGitHubCallBack,
    resetPassword,
    changeUserRol,
    sendResetPasswordEmail,
    uploadDocuments,
    getAllUsers,
    deleteAfterTwoDays,
    deleteUser
} from '../controllers/users.controller.js'
import passport from "passport";
import {reqAuth} from '../middlewares/auth.js'
import upload from '../utils/multer.js'

const router = Router()

    router.post('/register',passport.authenticate('register', {failureRedirect:'failregister'}), postRegister)
    router.post('/login',passport.authenticate('login', {failureRedirect:'/faillogin'}), postLogIn)
    router.get('/logout', logOutUser)
    router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/logins'}), postGitHubCallBack)
    router.get('/login-github',passport.authenticate('github', {scope: ['user:email']}), (req, res) => {})
    router.post('/sendResetPasswordEmail', sendResetPasswordEmail)
    router.post('/passwordReset/', resetPassword)
    router.post('/premium/:uid', changeUserRol)
    router.post('/:uid/documents', upload.array('documents'),uploadDocuments)
    router.get('/', getAllUsers)
    router.delete('/', deleteAfterTwoDays)
    router.delete('/delete/:uid', deleteUser)
 
export default router




 



