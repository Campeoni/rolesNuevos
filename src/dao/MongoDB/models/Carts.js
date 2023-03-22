import {ManagerMongoDB} from "../../../db/mongoDBManager.js";
import mongoose, {Schema} from "mongoose"
import { getManagerProducts } from '../../daoManager.js' 

const url = process.env.URLMONGODB;

const data = await getManagerProducts();
const managerProducts = new data.ManagerProductDB;

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
  async getElementById(id){
    this._setConnection();
    try{  
      return await this.model.findById(id).populate('products.productId')
    } catch(error) {
      return error
    }
  }

  addProductInCart = async (cid, pid)=>{
    this._setConnection()
    try {
      
      const product = await managerProducts.getElementById(pid)
      
      if (product) {
        const cart = await this.model.findById(cid).populate('products.productId')
        const existProduct = cart.products.find(element => element.productId.id === pid)
        if (!existProduct) {
          cart.products.push({productId:pid})
          await cart.save()
          return true
          
        } else {
          throw new Error("Producto ya existe")       
        }

      } else {
        throw new Error("Producto no existe")     
      }
    } catch (error) {
      return error.message
    }
  }

  changeQuantity = async (cid, pid, quantity)=>{
    this._setConnection()
    try {       
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
        return true

      
    } catch (error) {
      return error.message
    }
  }

  changeAllCart = async (cid, products)=>{
    this._setConnection()
    try {       
        const cart = await this.model.findById(cid)

        cart.products = products
        await cart.save()
        return true
      
    } catch (error) {
      return error.message
    }
  }
  deleteProduct = async (cid, pid)=>{
    this._setConnection()
    try {       
        const cart = await this.model.findById(cid).populate('products.productId')

        cart.products = cart.products.filter((element)=> {return element.productId.id!==pid})        

        await cart.save()
        return true

      
    } catch (error) {
      return error.message
    }
  }

  deleteProducts = async (cid)=>{
    this._setConnection()
    try {       
        const cart = await this.model.findById(cid)

        cart.products = []
        await cart.save()
        return true

      
    } catch (error) {
      return error.message
    }
  }

}