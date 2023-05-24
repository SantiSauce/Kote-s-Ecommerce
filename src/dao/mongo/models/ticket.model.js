import mongoose from 'mongoose'

const collection = 'tickets'

const ticketSchema = mongoose.Schema({
    code: String,
    purchase_datetime: String,
    amount: Number,
    purchaser: String,
    products: Array
})

const ticketModel = mongoose.model(collection, ticketSchema)

export default ticketModel