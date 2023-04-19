import {ManagerMongoDB} from "../db/mongoDBManager.js";
import mongoose, {Schema} from "mongoose"
import {managerProducts} from "../../../controllers/Product.controller.js"
import config from "../../../config/config.js";

const url = config.urlMongoDb;

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

export class ManagerCartsDB extends ManagerMongoDB{
  constructor() {
    super(url, "carts", cartsSchema)
  }  

  getElementById = async (cid) => {
    this._setConnection();
    const cart = await this.model.findById(cid).populate('products.productId')
    return cart
  }

  addProductInCart = async (cid, pid)=>{
    this._setConnection()
    const product = await managerProducts.getElementById(pid)
    
    if (product) {
      const cart = await this.model.findById(cid).populate('products.productId')
      const existProduct = cart.products.find(element => element.productId.id === pid)
      if (!existProduct) {
        cart.products.push({productId:pid})
        await cart.save()
        return cart
        
      } else {
        cart.products = cart.products.map((element)=>
        { 
          if( element.productId.id===pid){
            element.quantity++
          }             
          return element             
        })        
        await cart.save()
        return cart
      }

    } else {
      throw new Error("Producto no existe")     
    }
  }

  changeQuantity = async (cid, pid, quantity)=>{
    this._setConnection()
      
    const cart = await this.model.findById(cid).populate('products.productId')
    const existProduct = cart.products.find(element => element.productId.id === pid)
  
    if (existProduct) {
      cart.products = cart.products.map((element)=>
      { 
        if( element.productId.id===pid){
          element.quantity = quantity
        }             
        return element             
      })        
    } else {          
      throw new Error("Producto enviado no existe")       
    }
    await cart.save()
    return cart.products
  }

  changeAllCart = async (cid, products)=>{
    this._setConnection()
    const cart = await this.model.findById(cid)

    cart.products = products
    await cart.save()
    return cart
  }
  
  deleteProduct = async (cid, pid)=>{
    this._setConnection()
          
    const cart = await this.model.findById(cid).populate('products.productId')
    const filteredCart = cart.products.filter((element)=> {return element.productId.id!==pid})        
    if (filteredCart.length !== cart.products.length){      
      cart.products = filteredCart
      await cart.save()
      return cart      
    } else {
      return null
    }
  }

  deleteProducts = async (cid)=>{
    this._setConnection()

    const cart = await this.model.findById(cid)
    cart.products = []
    await cart.save()
    return cart
  }
}