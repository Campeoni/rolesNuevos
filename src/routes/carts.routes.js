import { Router } from "express";
import {deleteProductsCart, putProductsCart, getCart, addProductInCart, putQuantityProduct, deleteProductCart, postCart } from "../controllers/cart.controller.js"
import {purchaseCart} from "../controllers/purchase.controller.js"
import { passportError } from "../utils/errorMessages.js";
import { roleVerification } from "../utils/rolVerification.js";

// "/api/carts"
const routerCarts = Router()

routerCarts.post("/",postCart);

routerCarts.route("/:cid") 
  .get(getCart)
  .delete(deleteProductsCart)
  .put(putProductsCart)

routerCarts.route("/:cid/products/:pid")
  .post(passportError('jwt'),roleVerification(['user']), addProductInCart)
  .put(passportError('jwt'),roleVerification(['user']), putQuantityProduct)
  .delete(deleteProductCart)

  
routerCarts.route("/:cid/purchase")
  .post(passportError('jwt'),roleVerification(['user']), purchaseCart)

export default routerCarts