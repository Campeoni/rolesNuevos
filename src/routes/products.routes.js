import { Router } from 'express';
import { getProducts, getProduct, postProduct, putProduct, deleteProductCont } from '../controllers/product.controller.js';

const routerProducts = Router()

routerProducts.route("/")
  .get(getProducts)
  .post(postProduct)

routerProducts.route("/:pid")
  .get(getProduct)
  .put(putProduct)
  .delete(deleteProductCont)

export default routerProducts