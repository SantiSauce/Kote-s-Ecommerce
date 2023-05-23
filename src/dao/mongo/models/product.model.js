import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const collection = 'products'

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: Array,
    code: String,
    stock: Number,
    category: String,
    status: Boolean,
    owner: {
        type: String,
        ref: 'users',
        default: 'admin'
    }
})
productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, productSchema)

export default productModel
