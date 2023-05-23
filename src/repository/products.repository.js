import ProductDTO from '../dao/DTO/product.dto.js'

export default class ProductRepository {
     
    constructor(dao){
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    } 

    getPaginate = async(search, options) => {
        return await this.dao.getPaginate(search, options)
    }

    getById = async(pid) => {
        return await this.dao.getById(pid)
    }

    getStock = async(pid) => {
        return await this.dao.getStock(pid)
    }

    getPrice = async(pid) => {
        return await this.dao.getPrice(pid)
    }

    verifyCode = async(code) => {
        return this.dao.verifyCode(code)
        
    }

    create = async(data) => {
        const productToInsert = new ProductDTO(data)
        const result =  await this.dao.create(productToInsert)
        return result
    }

    delete = async(id) => {
        await this.dao.delete(id)
        return true
    }

    update = async(id, data) => {
        const productToUpdate = new ProductDTO(data)
        await this.dao.update(id, productToUpdate)
        return await this.dao.getOne(id)
    }

    decreaseStock = async(pid, quantity) => {
        await this.dao.decreaseStock(pid, quantity)
    }
}