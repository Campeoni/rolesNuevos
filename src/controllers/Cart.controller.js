import { getManagerCarts } from '../dao/daoManager.js'

const data = await getManagerCarts();
export const managerCarts = new data.ManagerCartsDB;

export const createCart = async (req, res) => {  //Inserta un nuevo carrito
  try {
    const response = await managerCarts.addElements();   

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

    const cart = await managerCarts.getElementById(cid);
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
    let answer = await managerCarts.deleteProducts(cid);
    res.status(200).json(answer); 
  
  } catch (error) {
    res.status(500).json({
      message : error.message
    })   
  }
}

export const updateCart = async (req, res) => {  // pisa todo el carrit con los productos enviados
  try {
    const cid = req.params.cid
    const products = req.body
    let answer = await managerCarts.changeAllCart(cid, products);
    res.status(200).json(answer); 
  
  } catch (error) {
    
    res.status(500).json({
      message : error.message      
    })
  }
}

export const insertProductCart = async (req, res) => {  //Inserta nuevos producto al carrito especificado
  try {
    const cid = req.params.cid
    const pid = req.params.pid
      
    const cart = await managerCarts.addProductInCart(cid,pid);

    res.status(200).json(cart)
      
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const updateQuantityProduct = async (req, res) => {  //Modifica cantidades de un producto
  try {
      const cid = req.params.cid
      const pid = req.params.pid
      const { quantity } = req.body
      
      let answer = await managerCarts.changeQuantity(cid,pid,quantity);      
      res.status(200).send(answer); 
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
}

export const deleteProductCart = async (req, res) => {  //Elimina productos del carrito especificado
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    let answer = await managerCarts.deleteProduct(cid,pid);
    res.status(200).json(answer? answer : "producto no encontrado" ); 
  
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}