/*import usersModel from "../mongo/models/users.model.js"
import cartModel from "../mongo/models/carts.model.js"
import { cartMongoManager } from "./index.js"
export class userManagerDB {

    getAllUsers = async () => {

        try {
            const users = await usersModel.find().lean().exec()
            if(!users){
                console.error('Users not found')
            }
            return users
            
        } catch (error) {
            console.log(error);
        }
    }

    getUserByEmail = async(email) =>{

        try {
            const user = await usersModel.findOne(email)
            return user            
        } catch (error) {
            console.log(error);
        }
    }

    getUserById = async (id) => {
        try {
            const user = await usersModel.findOne({_id:id})
            return user
        } catch (error) {
            console.log(error);            
        }
    }

    createUserCart = async () => {
        await cartMongoManager.addCart()
        const carts = await cartMongoManager.getCarts()
        const lastCart = carts.pop()
        return lastCart._id
    }
    
   
  






}
*/