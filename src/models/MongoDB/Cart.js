import mongoose, {Schema} from "mongoose"

const cartsSchema = new mongoose.Schema({
  products: {
    type:[{
      productId:{
        type: Schema.Types.ObjectId,
        ref: 'products'
      },
      quantity: {
        type: Number,
        default:1
      }    
    }], 
    default: []
  }
})

const cartModel = model("cart", cartsSchema);

export default cartModel