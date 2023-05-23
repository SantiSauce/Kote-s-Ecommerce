import {connect, set } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export default class MongoConnection {
    static #instance

    constructor() {
        set('strictQuery', true)
        connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }

    static getInstance = () => {
        if(this.#instance){
            console.log(("Already connected to mongoDB"))

            return this.#instance
        }
        this.#instance = new MongoConnection();
        console.log("Connected to MongoDB");
    
        return this.#instance;
    }
}