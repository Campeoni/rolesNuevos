import { Router } from "express";
import { getManagerProducts } from '../dao/daoManager.js'

const routerProducts = Router()

const data = await getManagerProducts();
const managerProducts = new data();

//Recupera todos los productos. puede ser limitado si se informa por URL
routerProducts.get("/", async (req, res) => {
  let { limit, page, sort, query } = req.query;
  
  limit || (limit = 10)
  page  || (page  =  1)

  
  console.log("sort= ", sort);
  console.log("query= ", query);

  const products = await managerProducts.getElements(limit);
  res.send(products)
});


  /* 
//Recupera el producto por el id indicado en la URL
routerProducts.get("/:pid", async (req, res) => {
  const products = await productsFile.getProductById(req.params.pid);  
  res.send(JSON.stringify(products)); //Devuelve el producto con el id
  
});

//Inserta un nuevo producto
routerProducts.post("/", async (req, res) => {  
  let answer = await productsFile.addProduct(req.body);
  res.send(answer === true ? "Producto agregado" : answer); 
});

//Actualiza el producto especificado
routerProducts.put("/:pid", async (req, res) => {
  let answer = await productsFile.updateProduct(req.params.pid,req.body);
  res.send(answer === true ? "Producto actualizado" : answer);   
});

//Elimina el producto especificado
routerProducts.delete("/:pid", async (req, res) => {
  let answer = await productsFile.deleteProduct(req.params.pid);
  res.send(answer === true ? "Producto eliminado" : answer);   
}); */

export default routerProducts