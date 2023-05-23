import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export let Cart
export let Message
export let Product
export let User
export let Ticket


switch (process.env.PERSISTENCE) {
    default: //case 'MONGO':
        console.log('connecting mongo..dfvf.')

        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
          }, (error) => {
            if (error) {
              console.error('Error de conexión a MongoDB:', error);
            } else {
              console.log('Conexión exitosa a MongoDB');
            }
          });
          

        const {default: ProductMongo} = await import ('./mongo/product.mongo.js')
        const {default: CartMongo} = await import ('./mongo/cart.mongo.js')
        const {default: UserMongo} = await import ('./mongo/user.mongo.js')
        const {default: TicketMongo} = await import ('./mongo/ticket.mongo.js')

        Product = ProductMongo
        Cart = CartMongo
        User = UserMongo
        Ticket = TicketMongo

        break

}