import mongoose from 'mongoose'

const cartCollection = 'carts'
 
const Schema = mongoose.Schema

const cartSchema = new Schema({
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number
            }
        ],
        default: []
    }
})

cartSchema.pre('findOne', function() {
    this.populate('products.product')
})
cartSchema.pre('find', function()  {
    this.populate('products.product')
})
const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel