import { productManagerFileSystem } from "./productManager.js";
import { cartManagerFileSystem } from "./cartManager.js";


export const productManager = new productManagerFileSystem("./db/productos.json")

export const cartManager = new cartManagerFileSystem("./db/carritos.json")


