import cartModel from "./models/carts.model.js"
import productModel from "./models/product.model.js"

export default class Cart {
    constructor(){}

    get = async() => { 
        return await cartModel.find()
    }

    create = async(data) => {
        await cartModel.create(data)
        return true
    }

    getById = async(id) => {
        return await cartModel.findOne({_id: id}).lean().exec()
    }

    delete = async(id) => {
        await cartModel.deleteOne({_id: id})
        return true
    }

    addProduct = async(id, productId) => {
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
                    await cartModel.updateOne({_id: id, 'products.product': productId},{$inc:{'products.$.quantity':+1}})
                }
                if(!productoABuscarEnCarrito){//producto no esta en carrito
                    const newProduct = {product: valideProduct._id, quantity: 1}
                    cart.products.push(newProduct) 
                    await cartModel.updateOne({_id: id},cart)           
                }
            }          
        }
    }

    deleteProduct = async(cid, pid) => {        
        await cartModel.updateOne({_id:cid,}, {$pull:{products:{product: pid}}})
    }  
    
    deleteAllProducts = async(cid) => {
        await cartModel.updateOne({_id: cid},{$set: {products: []}})
    }

    update = async(cid, products) => {
        const cart = await cartModel.findOne({_id: cid}).lean().exec()
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
                        await cartModel.updateOne({_id: cid, 'products.product': element},{$inc:{'products.$.quantity':+1}})   
                   }
                   if(!productoABuscarEnCarrito){//producto no esta en carrito
                       const newProduct = {product: valideProduct._id, quantity: 1}
                       cart.products.push(newProduct) 
                       await cartModel.updateOne({_id: cid},cart)           
                   }
                }
            });
       }
    }

    updateQuantity = async(cid, pid, obj) => {
        await cartModel.updateOne({_id: cid, 'products.product': pid},{$set:{'products.$.quantity':obj.quantity}})
    }

    getLastCart = async() => {
        const cartsList = await cartModel.find()
        const cart = cartsList.pop()
        return cart
    }

    getTotal = async(cid) => {
        try {
            const cart = await cartModel.findOne({_id: cid})
            const rejectedProducts = [];
            const purchasedProducts = [];
          
            const productChecks = await Promise.all(
              cart.products.map(async (product) => {
                  purchasedProducts.push(product);
                  const knowPriceProduct = await productModel.findOne({_id: product.product})
                  const price = knowPriceProduct.price
                  const subtotal = price * product.quantity;
                  return subtotal;
              })
            );
          
            const total = productChecks.reduce((acc, cur) => acc + cur, 0);
            return total
            
          } catch (error) {
            return error
          }
    }


}