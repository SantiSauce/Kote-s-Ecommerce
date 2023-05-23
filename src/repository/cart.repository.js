import CartDTO from '../dao/DTO/cart.dto.js'

export default class CartRespository {

    constructor(dao){
        this.dao = dao
    }
 
    get = async() => {
        return await this.dao.get()
    }

    create = async(data) => {
        const dataToInsert = new CartDTO(data)
        const result = await this.dao.create(dataToInsert)
        return true
    }

    getById = async(id) => {
        return await this.dao.getById(id) 
    }

    delete = async(id) => {
        await this.dao.delete(id)
        return true
    }


    addProduct = async(cid, pid) => {
        await this.dao.addProduct(cid, pid)
        return await this.dao.getById(cid)
    }

    deleteProduct = async(cid, pid) => {
        await this.dao.deleteProduct(cid, pid)
    }

    deleteAllProducts = async(cid) => {
        await this.dao.deleteAllProducts(cid)
        return await this.dao.getById(cid)
    }

    update = async(cid, products) => {
        await this.dao.update(cid, products)
        return await this.dao.getById(cid) 
    }

    updateQuantity = async(cid, pid, obj) => {
        if( (await this.dao.getById(cid)) ){
            await this.dao.updateQuantity(cid, pid, obj)
            return await this.dao.getById(cid)
        }
    }

    getLastCart = async() => {
        const cart = await this.dao.getLastCart()
        return cart
    }

    getTotal = async(cid) => {
        const total = await this.dao.getTotal(cid)
        return total
    }
    
        
}