import passport from "passport";
import local from "passport-local"
import jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2'
import dotenv from 'dotenv'



import {createHash, isValidPassword} from "../utils/utils.js"
import { generateToken } from "../utils/utils.js";
import { extractCookie } from "../utils/utils.js";
import { CartService, UserService } from "../repository/index.js";

dotenv.config()


const LocalStrategy = local.Strategy

const JTWStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {

    passport.use(
        'github',
         new GitHubStrategy(
        {
            clientID: 'Iv1.80eab679689061f3',
            clientSecret: '784034fe38fd6fe5bbada150bf3fec518a0d64e5',
            callbackURL: 'http://localhost:8082/session/githubcallback',
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserService.getByEmail(profile._json.email)
                if(user) {
                    user.token = generateToken(user)
                    return done(null, user)
                }
                const newCart = {
                    products: []
                }
                await CartService.create(newCart)
                const cart = await CartService.getLastCart()
                const newUser = {
                    first_name: profile._json.name,
                    last_name:'',
                    email: profile._json.email,
                    password: '',
                    cart: cart._id,
                }
                const result = await UserService.create(newUser)
                result.token = generateToken(result)
                return done(null, result)
            } catch (error) {
                return done('error github login' + error) 
            }
        }
    ))
    
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
            const {first_name, last_name, age, email} = req.body
            try {
                if(!first_name || !last_name || !email){
                    
                }
                let user = await UserService.getByEmail(username)
                if(user) {
                    console.log('User already exists');
                    return done(null, false)
                }
                if(email == 'adminCoder@coder.com'){
                    const newUser = {
                        first_name,
                        last_name,
                        age,
                        email,
                        password:createHash(password),
                        rol: 'admin'
                    }
                    let result = await UserService.create(newUser)
                    return done(null, result)
                }
                const newCart = {
                    products: []
                }
                await CartService.create(newCart)
                const cart = await CartService.getLastCart()
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    cart: cart._id,
                    password:createHash(password)
                }
                let result = await UserService.create(newUser)
                return done(null, result)

            } catch (error) {
                return done('Error when looking for user'+error)                
            }
        }))
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) =>{
        try {
                const user = await UserService.getByEmail(username)
                if(!user) {
                    return done(null, false)
                }

                if(!isValidPassword(user, password)) return done (null, false)
                const token = generateToken(user)
                user.token = token
                const data = user
                return done(null, {data, token})
            } catch (error) {
                return done(null, user)
            }
        }))
    passport.use('jwt', new JTWStrategy({
            jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
            secretOrKey: process.env.JWT_PRIVATE_KEY
        }, async (jwt_payload, done) => {
            done(null, jwt_payload)
        }))
    passport.serializeUser((user, done) => {
            const serializedUser = { ...user, token: user.token };
            done(null, serializedUser);
          });
    passport.deserializeUser(async (user, done)=>{
            //const user = await UserService.getById(id)
            done(null, user)
        }) 

}
export default initializePassport