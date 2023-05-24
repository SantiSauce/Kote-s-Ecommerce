import productModel from "./models/product.model.js"

export default class Product {

    constructor(){

    }

    get = async() => {
        return await productModel.find()
    }

    getPaginate = async(search, options) => {
        return await productModel.paginate(search, options)
    }
    
    getById = async(id) => {
        return await productModel.findOne({_id: id}).lean().exec()
    }

    getStock = async(pid) => {
        const product = await productModel.findOne({_id:pid})
        return product.stock
    }

    getPrice = async(pid) => {
        const product = await productModel.findOne({_id:pid})
        return product.price
    }

    verifyCode = async(code) => {
        const result = await productModel.findOne({code: code}).lean().exec()
        if(result === null) return false 
        return true
    }

    create = async(data) => {
        await productModel.create(data)
        return true
    }
    delete = async(id) => {
        await productModel.deleteOne({_id: id})
        return true
    }

    update= async(pid, data) => {
        await productModel.updateOne({_id:pid}, {$set:data})
        return true
    }
    decreaseStock = async(pid, quantity) => {
        const stock = await this.getStock(pid)
        await productModel.updateOne({_id:pid}, {$set:{'stock':(stock-quantity)}})
       
    }


}