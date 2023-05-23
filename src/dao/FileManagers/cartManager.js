import fs from "fs"
import { productManager } from "./index.js"
export class cartManagerFileSystem{
    
    constructor(path){        
        this.path = path
        
        this.#init()
    }
    

    #init(){
        try {
            const existsFile = fs.existsSync(this.path)

            if(existsFile) {return}
            
            else {fs.writeFileSync(this.path, JSON.stringify([]))}
        } catch (error) {
            console.log(error);
            
        }
    }

    getNextId = (list) =>{
        const count = list.length
        return (count >0) ? list[count-1].id + 1 : 1
    }

    addCart = async() => {
                 
            const leer = await fs.promises.readFile(this.path, "utf-8")
            const listaDeCarritos = JSON.parse(leer)
            let id = this.getNextId(listaDeCarritos)
            const nuevoCarrito = {id, products:[]};
            listaDeCarritos.push(nuevoCarrito)
            await fs.promises.writeFile(this.path, JSON.stringify(listaDeCarritos))
            console.log("El carrito se ha ingresado correctamente")
            }
    
    async getCartById (id) {
        const listadoDeCarritos = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        const carrito = listadoDeCarritos.find(carrito => carrito.id == id) 
      
        return carrito
    }

    addProductToCart = async (id, productId) =>{

        const cartsList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))

        for (let i = 0; i < cartsList.length; i++) { 
            if(cartsList[i].id == id){               
                if(cartsList[i].products.length == 0){ 
                    const newProduct = {product: productId, quantity: 1}
                    cartsList[i].products.push(newProduct)
                    break
                }
                if(cartsList[i].products.find(producto => producto.product == productId)){
                    for (let j = 0; j < cartsList[i].products.length; j++) {
                        if(cartsList[i].products[j].product == productId){
                            cartsList[i].products[j].quantity++
                            break
                        }                        
                    }
                }else{
                    const newProduct = {product: productId, quantity: 1}
                    cartsList[i].products.push(newProduct)
                }
                break
            }            
        }
        await fs.promises.writeFile(this.path, JSON.stringify(cartsList))        
      } 
      
      



}
        