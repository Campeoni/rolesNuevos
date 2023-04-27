import cartModel from "../models/MongoDB/Cart.js";

export const findCartById = async (cid) => {
	try {
			const cart = await cartModel.findById(cid)
			return cart		
	} catch (error) {
			throw new Error(error);
	}
}

export const createCart = async () => {
	try {
			const newCart = await cartModel()
			await newCart.save()
			return newCart
	} catch (error) {
			throw new Error(error);
	}
}

export const deleteCart = async (cid) => {
	try {
			return await cartModel.findByIdAndDelete(cid);
	} catch (error) {
			throw new Error(error);
	}
}

export const updateCart = async (cid, data) => {
	try {
			return await cartModel.findByIdAndUpdate(cid, data);
	} catch (error) {
			throw new Error(error);
	}
}

/* 
  
export const addProductInCart = async (cid, pid)=>{
    
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
  
export const changeQuantity = async (cid, pid, quantity)=>{
    
      
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
  
export const changeAllCart = async (cid, products)=>{
    
    const cart = await this.model.findById(cid)
  
    cart.products = products
    await cart.save()
    return cart
  }
  
export const deleteProduct = async (cid, pid)=>{          
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
  
export const deleteProducts = async (cid)=>{
	

	const cart = await this.model.findById(cid)
	cart.products = []
	await cart.save()
	return cart
} */