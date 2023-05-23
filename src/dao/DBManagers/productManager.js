import productModel from "../mongo/models/product.model.js"
import mongoose from "mongoose"
import express from 'express'



export class productManagerDB {


    getNextId = (list) =>{
        const count = list.length
        return (count >0) ? list[count-1].id + 1 : 1
    }//no funciona

    addProduct = async(product) => 
    {
        if((!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category)){
            console.error("Complete todos los campos")
        }
        const productList = this.getProducts()
        const valide = await productModel.findOne({code: product.code}).lean().exec()

        if(!valide){
            const newProduct = {title: product.title, description: product.description, code: product.code, price: product.price, status: true, stock: product.stock, category: product.category, thumbnail: product.thumbnail}
            const createdProduct = new productModel(newProduct)
            await createdProduct.save()
            return createdProduct.title
        }console.log('El producto ya fue ingresado');
    }

    /*getProducts = async (filtros, query) =>{

        try {
            if(query === 'stock'){//busco por disponibilidad
                const products = await productModel.paginate({}, filtros)
                if(!products){
                    throw new Error("Out of stock")
                }
                products.prevLink = products.hasPrevPage ? `/?page=${products.hasPrevPage}` : null
                products.nextLink = products.hasNextPage ? `/?page=${products.hasNextPage}` : null

                return products
            }
            if(query !== null && query !== 'stock'){// sino busco por categoria
                const products = await productModel.paginate({category: query}, filtros)                
                if(!products){//si categoria no existe 
                    throw new Error('No products with such category available')
                }
                products.prevLink = products.hasPrevPage ? `/?page=${products.hasPrevPage}` : null
                products.nextLink = products.hasNextPage ? `/?page=${products.hasNextPage}` : null

                return products
            }
            if(query === null){
                const products = await productModel.paginate({},filtros)
                if(!products){
                    throw new Error('No products available')
                }
                products.prevLink = products.hasPrevPage ? `/?page=${products.hasPrevPage}` : null
                products.nextLink = products.hasNextPage ? `/?page=${products.hasNextPage}` : null

                return products                
            }

        } catch (error) {
            throw new Error(error.message)           
        }       
    }*/

        getProducts = async (filter, search, options) => {
            try {
              if (filter === "stock") {
                const products = await productModel.paginate({stock:0}, options)
        
                if (!products) {
                  throw new Error("THE DB IS EMPTY");
                }
        
                return products;
              }
        
              if (filter !== "stock") {
                const products = await productModel.paginate(search, options);
        
                if (!products) {
                  throw new Error("THE DB IS EMPTY");
                }
        
                return products;
              }    
            } catch (error) {
              throw new Error(error.message);
            }
          };
    

    getProductById = async (id) => {
        const product = await productModel.findOne({_id: id}).lean().exec()
        if(product){
            return product
        }else{console.log("el producto no existe")}
    }
       
    deleteProduct = async (id) =>{
        const product = await productModel.findOne({_id: id}).lean().exec()

        if((product)){ 
            await productModel.deleteOne({ _id: id })
        }else{console.log("el producto no existe")}
    }

    updateProduct = async (id, product) => {
        const productValidation = await productModel.findOne({_id:id}).lean().exec()
        if(productValidation){

            await productModel.updateOne({_id:id}, {$set:product})
            const productUpdated = await productModel.findOne({_id:id}).lean().exec()
            return productUpdated
        }
        
    }
}