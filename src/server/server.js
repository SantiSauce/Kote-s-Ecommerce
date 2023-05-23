import express from 'express'
import dotenv from 'dotenv'
import handlebars from 'express-handlebars'
import passport from "passport"
import initializePassport from "../utils/passport.config.js"
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser'
import __dirname from '../dirname.js'
import session from "express-session"
import Routers from '../routes/index.js'
import MongoConnection from "../mongo.js"
import socket from "../socket.js"
import { MongoStoreInstance } from "../utils/utils.js"
import {Server} from 'socket.io'
import { addLogger } from "../utils/logger.js"
import initSwagger from '../swagger.js'
import swaggerUiExpress from 'swagger-ui-express'
import cors from 'cors'


//const and env variables
dotenv.config()
const app = express()

//init mongoDB
MongoConnection.getInstance()

//passport
initializePassport();

//handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main.handlebars'}))
app.set('views', __dirname + '/views')
app.set('partials', __dirname + '/partials')
app.set('view engine', 'handlebars')
app.use('/css', express.static(__dirname +'/public/css' ))

//middlewares
app.use(session(MongoStoreInstance))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/public'))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(addLogger);
app.use(
    "/api/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(initSwagger())
)
app.use(cors())
//router
app.use('/', Routers)


//app.listen
const httpServer = app.listen(process.env.PORT, () => {
    console.log('Server Up!');
})

//socket
const io = new Server(httpServer)
socket(io)

/*
// const httpServer = new HttpServer(app)
// const io = new IOServer(httpServer)
// mongoose.connect(process.env.MONGO_URL, (error) => {
//     if(error){
//         console.log('DB No conected')
//         return
//     }
// })
// const server = httpServer.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`)
// })
// server.on('error', (error)=>{
//     console.log(error)
// })
*/