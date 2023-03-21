import { Router } from "express";
import { getManagerCarts } from '../dao/daoManager.js'

const routerCarts = Router()


const data = await getManagerCarts();
const managerCarts = new data.ManagerCartsDB;

//recupera el carrito especificado
routerCarts.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid
    
    const response = {
      status: "Success"
    }  
    response.return = await managerCarts.getElementById(cid);      
    
    
    res.send(response);

  } catch (error) {
    const response = {
      status: "Error",
      error : error.message
    }
    res.send(response); 
  }  
});

//Inserta un nuevo carrito
routerCarts.post("/", async (req, res) => {  
  try {
    const response = {
      status: "Success"
    }  
    response.return = await managerCarts.addElements();   
    res.send(response); 
    
  } catch (error) {
    const response = {
      status: "Error",
      error : error.message
    }
    res.send(response); 
  }
});

//Inserta nuevos producto al carrito especificado
routerCarts.post("/:cid/products/:pid", async (req, res) => {  
  try {
    const cid = req.params.cid
    const pid = req.params.pid
      
    let answer = await managerCarts.addProductInCart(cid,pid);
    res.send(answer === true ? "Producto agregado al carrito" : answer); 
  
  } catch (error) {
    const response = {
      status: "Error",
      error : error.message
    }
    res.send(response); 
  }
});

//Modifica cantidades de un producto
routerCarts.put("/:cid/products/:pid", async (req, res) => {  
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const { quantity } = req.body
      
      let answer = await managerCarts.changeQuantity(cid,pid,quantity);      
      res.send(answer === true ? `El producto ${pid} ahora tiene una cantidad de ${quantity}`: answer); 
  
  } catch (error) {
      const response = {
        status: "Error",
        error : error.message
      }
      res.send(response); 
  }
});

//Modifica cantidades de un producto
routerCarts.put("/:cid/products/:pid", async (req, res) => {  
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const { quantity } = req.body
      
      let answer = await managerCarts.changeQuantity(cid,pid,quantity);      
      res.send(answer === true ? `El producto ${pid} ahora tiene una cantidad de ${quantity}`: answer); 
  
  } catch (error) {
      const response = {
        status: "Error",
        error : error.message
      }
      res.send(response); 
  }
});

//Modifica todo el carrito
routerCarts.put("/:cid", async (req, res) => {  
  try {
    const cid = req.params.cid
    const products = req.body
    let answer = await managerCarts.changeAllCart(cid, products);
    res.send(answer === true ? "Carrito modificado" : answer); 
  
  } catch (error) {
    const response = {
      status: "Error",
      error : error.message
    }
    res.send(response); 
  }
});

//Elimina productos del carrito especificado
routerCarts.delete("/:cid/products/:pid", async (req, res) => {  
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    let answer = await managerCarts.deleteProduct(cid,pid);
    res.send(answer === true ? "Ejecucion exitosa" : answer); 
  
  } catch (error) {
    const response = {
      status: "Error",
      error : error.message
    }
    res.send(response); 
  }
});

//Vacia el carrito
routerCarts.delete("/:cid", async (req, res) => {  
  try {
    const cid = req.params.cid
    let answer = await managerCarts.deleteProducts(cid);
    res.send(answer === true ? "Carrito Vacio" : answer); 
  
  } catch (error) {
    const response = {
      status: "Error",
      error : error.message
    }
    res.send(response); 
  }
});

export default routerCarts