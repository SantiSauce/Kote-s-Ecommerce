import UserDTO from '../dao/DTO/user.dto.js'

export default class UsersRepository {
    
    constructor(dao){
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    }
    
    getAll = async() => {
        return await this.dao.getAll()
    }

    getSafeInfo = async(id) => {
        return await this.dao.getSafeInformation(id)
    }

    create = async(data) => {
        const dataToInsert = new UserDTO(data)
        const result = await this.dao.create(dataToInsert)
        return result

    }

    getById = async(id) => {
        return await this.dao.getById(id)
    } 

    getByEmail = async(email) => {
        return await this.dao.getByEmail(email)
    }


    getUserByCartId = async(cid) => {
        return await this.dao.getUserByCartId(cid)

    }

    resetPassword = async(user, newPassword) => {
        await this.dao.resetPassword(user, newPassword)
    }

    updateUserDocuments = async(cid, files) => {
        return await this.dao.updateUserDocuments(cid, files)
    }

    getUserDocuments = async(cid) => {
        return await this.dao.getUserDocuments(cid)
    }

    updateLastConnection = async(cid) => {
        const user = this.dao.updateLastConnection(cid)
        return true
    }

    getInactiveUsers = async() => {
        return this.dao.getInactiveUsers()
    }

    deleteUser = async(cid) => {
        await this.dao.deleteUser(cid)
        return true
    }

    changeUserRole = async(cid) => {
        await this.dao.changeUserRole(cid)
        return true
    }
}