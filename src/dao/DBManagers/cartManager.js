import cartModel from "../mongo/models/carts.model.js"
import productModel from "../mongo/models/product.model.js"
import mongoose from "mongoose"
import express from 'express'

export class cartManagerDB {
 

    getNextId = (list) =>{
        const count = list.length
        return (count >0) ? list[count-1].id + 1 : 1
    }

    getCarts = async () =>{
        return await cartModel.find().lean().exec()
    }

    getCartById = async (id) => {
        const cart = await cartModel.findOne({_id: id}).lean().exec()
        if(cart){
            return cart
        }else{console.log("el carrito no existe")}
    }

    addCart = async() => {
    
        const cartsList = await cartModel.find().lean().exec()
        const newCart = {products: []}
        const createdCart = new cartModel(newCart)
        await createdCart.save()
        console.log("El carrito se ha ingresado correctamente")
        }

    addProductToCart = async (id, productId) =>{

        const cart = await cartModel.findOne({_id: id}).lean().exec()
        const valideProduct = await productModel.findOne({_id:productId}).lean().exec()
        if(cart){//si existe carrito
            if(valideProduct){//si existe producto 
                const productoABuscarEnCarrito = await cartModel.findOne({_id:id, 'products.product': productId}).lean().exec()
                if(cart.products.length==0){//si lista de productos = vacia
                    const newProduct = {product: valideProduct._id, quantity: 1}
                    await cartModel.updateOne({_id: id},{products:newProduct})             
                }
                if(productoABuscarEnCarrito){//si producto fue ingresado entonces sumo 1 a quantity
                    //const index = cart.products.map(e => e.product).indexOf(productId)
                    //const quantity = cart.products[index].quantity
                    await cartModel.updateOne({_id: id, 'products.product': productId},{$inc:{'products.$.quantity':+1}})             

                }
                if(!productoABuscarEnCarrito){//producto no esta en carrito
                    const newProduct = {product: valideProduct._id, quantity: 1}
                    cart.products.push(newProduct) 
                    await cartModel.updateOne({_id: id},cart)           
                }

            }else{return console.log("Product not found");}           
        }else{return error}
    }

    deleteProductFromCart = async (cid, pid) =>{
        const cart = await cartModel.findOne({_id: cid}).lean().exec()
        const product = await productModel.findOne({_id: pid}).lean().exec()
        if(cart && product){           
            await cartModel.updateOne({_id:cid,}, {$pull:{products:{product: pid}}})
        }else{
            return (error)
        }        
    }

    deleteAllProductsFromCart = async (cid) => {
        try {
            await cartModel.updateOne({_id: cid},{$set: {products: []}})    
        }
        catch(error){
            console.log(error);
        }
}

    updateCart = async (cid, products) => {

        
        const cart = await cartModel.findOne({_id: cid}).lean().exec()
        //Array.from(products)
        //const result = Array.isArray(products)

        //const productIdArray = products.map(e => e._id)
        console.log(products);

        if(cart){
             products.forEach( async(element) => {
                const valideProduct = await productModel.findOne({_id:element}).lean().exec()
                if(valideProduct){//si existe producto 
                    const productoABuscarEnCarrito = await cartModel.findOne({_id:cid, 'products.product': element}).lean().exec()
                    if(cart.products.length==0){//si lista de productos = vacia
                        const newProduct = {product: valideProduct._id, quantity: 1}
                        await cartModel.updateOne({_id: cid},{products:newProduct})             
                    }
                    if(productoABuscarEnCarrito){//si producto fue ingresado entonces sumo 1 a quantity
                        //const index = cart.products.map(e => e.product).indexOf(productId)
                        //const quantity = cart.products[index].quantity
                        await cartModel.updateOne({_id: cid, 'products.product': element},{$inc:{'products.$.quantity':+1}})             
    
                    }
                    if(!productoABuscarEnCarrito){//producto no esta en carrito
                        const newProduct = {product: valideProduct._id, quantity: 1}
                        cart.products.push(newProduct) 
                        await cartModel.updateOne({_id: cid},cart)           
                    }
    
                }else{return console.log("Product not found");}
                  
                
            });
        }         
    }

    updateQuantity = async (cid, pid, obj) => {
        const cart = await cartModel.findOne({_id: cid}).lean().exec()
        const product = await productModel.findOne({_id: pid}).lean().exec()
        if(cart && product){           
            await cartModel.updateOne({_id: cid, 'products.product': pid},{$set:{'products.$.quantity':obj.quantity}})             
        }else{
            return (error)
        }  
    }

    getLastCart = async () => {
        const carts = await this.getCarts()
        const lastCart = carts.pop()
        return lastCart._id
    }





}