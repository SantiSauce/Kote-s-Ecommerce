import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const usersCollection = 'users'

const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email:String,
    age: Number,
    password: String,
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    rol: {
        type: String,
        default: 'user'
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ]
    },
    last_connection: {
        type: String,
        default: null
      }
})

userSchema.virtual('token')
  .get(function() {
    return this._token;
  })
  .set(function(token) {
    this._token = token;
  });

userSchema.pre('findOne', function() {
    this.populate('cart')
}) 
userSchema.pre('find', function()  {
    this.populate('cart')
})

userSchema.plugin(mongoosePaginate)
const usersModel = mongoose.model(usersCollection, userSchema)

export default usersModel