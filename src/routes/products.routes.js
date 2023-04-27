import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'

const routerProducts = Router()

routerProducts.route("/")
  .get(getProducts)
  .post(createProduct)

routerProducts.route("/:pid")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct)

export default routerProducts