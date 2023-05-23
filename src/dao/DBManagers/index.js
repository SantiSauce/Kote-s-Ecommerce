import { productManagerDB } from "./productManager.js";
import { cartManagerDB } from "./cartManager.js";
import { userManagerDB } from "./userManager.js";

export const productMongoManager = new productManagerDB()
export const cartMongoManager = new cartManagerDB()
export const userMongoManager = new userManagerDB()
