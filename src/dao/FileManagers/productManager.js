import fs from "fs"

export class productManagerFileSystem{

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

    addProduct = async(obj) => 
    {

        if((!obj.title || !obj.description || !obj.price || !obj.thumbnails || !obj.code || !obj.stock || !obj.category))
            {console.log("Complete todos los campos")}

            if(fs.existsSync(this.path))
            {         
                const leer = await fs.promises.readFile(this.path, "utf-8")
                const listaDeProductos = JSON.parse(leer)
                const validate = listaDeProductos.find(codigo => codigo.code == obj.code)

                if(!validate){
                    let id = this.getNextId(listaDeProductos)
                    const nuevoProducto = {id, title: obj.title, description: obj.description, code: obj.code, price: obj.price, status: true, stock: obj.stock, category: obj.category, thumbnails: obj.thumbnails};
                    listaDeProductos.push(nuevoProducto)
                    await fs.promises.writeFile(this.path, JSON.stringify(listaDeProductos))
                    console.log("El producto se ha ingresado correctamente");

                }else{console.log("El producto ya fue ingresado");}             
            }if(!fs.existsSync(this.path)) { 
            const nuevoProducto = [{id:1, title, description, price, thumbnail, code, stock}];
            await fs.promises.writeFile(this.path, JSON.stringify(nuevoProducto))
            }

    }
            

    async getProduct ()  {
        
        const response = JSON.parse(await fs.promises.readFile(this.path, "utf-8")) 
        return response      
        //console.log (listadoDeProductos)
        
    }

    getProductById = async (id) => {
        const listadoDeProductos = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        const producto = listadoDeProductos.find(producto => producto.id == id) 
        if ((producto)){
            console.log(`Se ha encontrado el producto de ID ${id}`);
            console.log(producto);
            return producto
        }else{
            console.log(`Not Found`);
            return null
        }
    }
    
    deleteProduct = async (id) =>{
        const listadoDeProductos = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        const producto = listadoDeProductos.find(producto => producto.id == id) 
        if((producto)){ 
        const resultado = listadoDeProductos.filter(producto => producto.id != id)
         await fs.promises.writeFile(this.path, JSON.stringify(resultado))

        }else{console.log("el producto no existe");}
    }

    updateProduct = async (id, obj) =>{

        obj.id = id
        const listadoDeProductos = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))

        const indexOfProduct = listadoDeProductos.findIndex((product) => product.id == id )

        listadoDeProductos[indexOfProduct] = {...listadoDeProductos[indexOfProduct], ...obj}
        
        await fs.promises.writeFile(this.path, JSON.stringify(listadoDeProductos))

        /*for (let i=0; i<listadoDeProductos.length; i++){
            if(listadoDeProductos[i].id == id){
                listadoDeProductos[i] = obj
                break
            }
        }*/

    }
}