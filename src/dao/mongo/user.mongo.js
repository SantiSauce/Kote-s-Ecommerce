import usersModel from "./models/users.model.js"
import cartModel from "./models/carts.model.js"
 
export default class User {

    constructor(){ }

    get = async() => {
        const users = await usersModel.find()
        return users
    }

    getAll = async () => {
        const users = await usersModel.find({}, '_id first_name last_name email rol');
        const safeData = users.map(user => ({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            rol: user.rol
        }));
        return safeData;
    }

    getSafeInformation = async(id) => {
        const user = await usersModel.findOne({_id: id})
        const safeData = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            rol: user.rol
        }
        return {safeData}
        }

    create = async(data) => {
        await usersModel.create(data)
        return true
    }

    getById = async(id) => {
        return await usersModel.findOne({_id: id})
    }

    getByEmail = async(email) => {
        return await usersModel.findOne({email: email})
    }
    resetPassword = async(user, newPassword) => {
        await usersModel.findOneAndUpdate(
           { _id: user._id },
           { password: newPassword },
           { new: true }
         );
    }   

    getUserByCartId = async(cid) => {
        return await usersModel.findOne({cart:cid})        
    }

    updateUserDocuments = async(cid, files) =>{
        const user = await usersModel.findByIdAndUpdate(
            cid,
            {$addToSet: { documents: files.map(file => file.filename) } },
            { new: true}
        )
        return user
    }

    getUserDocuments = async(cid) => {
        const user = await usersModel.findOne({_id:cid})
        const documents = user.documents
        return documents
    }

    updateLastConnection = async (cid) => {
        const currentDate = new Date() 
        const user = await usersModel.findByIdAndUpdate(cid, {last_connection: currentDate})
        return true
    }

    getInactiveUsers = async() => {
        const inactiveUsers = await usersModel.find({
            last_connection: {
              $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Cambia 2 por 0.5 para pruebas de los últimos 30 minutos
            }
          })

        return inactiveUsers
    }

    deleteUser = async(cid) => {
        await usersModel.deleteOne({_id:cid})
        return true
    }

    changeUserRole = async(cid) => {
        const user = await usersModel.findOne({_id:cid})
        if(user.rol === 'user'){
            return await usersModel.findByIdAndUpdate(cid, {rol:'premium'})
        }else{
            return await usersModel.findByIdAndUpdate(cid, {rol:'user'})
        }
    }




}