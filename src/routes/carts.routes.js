import { Router } from "express";
import {deleteProductsCart, putProductsCart, getCart, addProductInCart, putQuantityProduct, deleteProductCart } from "../controllers/cart.controller.js"

// "/api/carts"
const routerCarts = Router()

//routerCarts.post("/",createCart);

routerCarts.route("/:cid") 
  .get(getCart)
  .delete(deleteProductsCart)
  .put(putProductsCart)

routerCarts.route("/:cid/products/:pid")
  .post(addProductInCart)
  .put(putQuantityProduct)
  .delete(deleteProductCart)

export default routerCarts