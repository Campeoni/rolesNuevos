import { Router } from "express";
import {createCart,deleteProductsCart, updateCart, getCart, insertProductCart, updateQuantityProduct, deleteProductCart } from "../controllers/cart.controller.js"

// "/api/carts"
const routerCarts = Router()

routerCarts.post("/",createCart);

routerCarts.route("/:cid") 
  .get(getCart)
  .delete(deleteProductsCart)
  .put(updateCart)

routerCarts.route("/:cid/products/:pid")
  .post(insertProductCart)
  .put(updateQuantityProduct)
  .delete(deleteProductCart)

export default routerCarts