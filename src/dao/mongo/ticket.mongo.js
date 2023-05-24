import ticketModel from "./models/ticket.model.js"

export default class Ticket {

    constructor() {}

    get = async() => {
        return await ticketModel.find()
    }

    getByEmail = async(email) => {
        return await ticketModel.findOne({email:email})
    }

    getByCode = async(code) =>{ 
        return await ticketModel.findOne({code:code})
    }

    getById = async(tid) => {
        return await ticketModel.findOne({_id: tid})
    }

    getArrayOfTickets = async(email) => {
        return await ticketModel.find({email:email})

    }
    create = async(data) => {
        return await ticketModel.create(data)
        
    }

    delete = async(tid) => {
        await ticketModel.deleteOne({_id:tid})
        return true
    }





}