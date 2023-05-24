import TicketDTO from '../dao/DTO/ticket.dto.js'

export default class TicketRepository {

    constructor(dao){
        this.dao = dao
    }
    
    get = async() => {
        return this.dao.get()
    }

    getByEmail = async(email) => {
        return this.dao.getByEmail(email)
    }

    getAllTickets = async(email) => {
        return this.dao.getArrayOfTickets(email)
    }

    getByCode = async(code) => {
        return await this.dao.getByCode(code)
    }

    getById = async(tid) => {
        return await this.dao.getById(tid)
    }

    create = async(data) => {
        const ticket = new TicketDTO(data)
        return await this.dao.create(ticket)
    }

    delete = async(tid) => {
        return await this.dao.delete(tid)
    }

    getlast = async(email) => {
        return await this.dao.getLast(email)
    }



}