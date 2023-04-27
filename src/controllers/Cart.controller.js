import { findCartById, createCart, deleteProducts, updateProductsCart } from '../services/cartService.js'
import { findProductById } from '../services/productService.js'

export const postCart = async (req, res) => {  //Inserta un nuevo carrito
  try {
    const response = await createCart();   
    res.status(200).json(response); 
    
  } catch (error) {
    res.status(500).json({
      message : error.message
    })   
  }
}

export const getCart = async (req, res) => {//recupera el carrito especificado
  try {
    const cid = req.params.cid    

    const cart = await findCartById(cid);

    if (cart.products.length !== 0 ){
      res.status(200).json(cart);
    } else {
      res.status(200).json("Carrito Vacio");      
    }

  } catch (error) {
    res.status(500).json({
      message : error.message
    })   
  }
}

export const deleteProductsCart = async (req, res) => {  //Vacia el carrito
  try {
    const cid = req.params.cid
    let answer = await deleteProducts(cid);
    res.status(200).json(answer); 
  
  } catch (error) {
    res.status(500).json({
      message : error.message
    })   
  }
}

export const putProductsCart = async (req, res) => {  // pisa todo el carrit con los productos enviados
  try {
    const cid = req.params.cid
    const products = req.body
    let answer = await updateProductsCart(cid, products);
    res.status(200).json(answer); 
  
  } catch (error) {
    
    res.status(500).json({
      message : error.message      
    })
  }
}

export const addProductInCart = async (req, res) => {  //Inserta nuevos producto al carrito especificado
  const cid = req.params.cid
  const pid = req.params.pid

  try {
      const product = await findProductById(pid)

      if (product) {
        const cart = await findCartById(cid).populate('products.productId')
        const existProduct = cart.products.find(element => element.productId.id === pid)
        
        if (!existProduct) {
          cart.products.push({productId:pid})          
        } else {
          cart.products = cart.products.map((element)=>
          { 
            if( element.productId.id===pid){
              element.quantity++
            }             
            return element             
          })        
        }    
        await cart.save()
        
        res.status(200).json(cart)

      } else {

        throw new Error("Producto no existe")     
      }      
  } catch (error) {
      res.status(500).json({
        message: error.message
      })
  }
}

export const putQuantityProduct = async (req, res) => {  //Modifica cantidades de un producto
  const cid = req.params.cid
  const pid = req.params.pid
  const { quantity } = req.body

  try {
      const cart = await cartModel.findById(cid).populate('products.productId')
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

      res.status(200).send(cart.products); 
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
}

export const deleteProductCart = async (req, res) => {  //Elimina productos del carrito especificado
  const cid = req.params.cid
  const pid = req.params.pid

  try {
      const cart = await findCartById(cid).populate('products.productId')
      const filteredCart = cart.products.filter((element)=> {return element.productId.id!==pid})        
      if (filteredCart.length !== cart.products.length){      
        cart.products = filteredCart
        await cart.save()
        res.status(200).json(cart);
      } else {
        res.status(200).send("El producto no existe en el carrito");
      }    
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}