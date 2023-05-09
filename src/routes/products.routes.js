import { Router } from 'express';
import { getProducts, getProduct, postProduct, putProduct, deleteProductCont } from '../controllers/product.controller.js';
import { passportError } from "../utils/errorMessages.js";
import { roleVerification } from "../utils/rolVerification.js";

//"/api/products"
const routerProducts = Router()

routerProducts.route("/")
  .get(getProducts)
  .post(passportError('jwt'), roleVerification(['admin']),postProduct)

routerProducts.route("/:pid")
  .get(getProduct)
  .put(passportError('jwt'), roleVerification(['admin']),putProduct)
  .delete(passportError('jwt'), roleVerification(['admin']),deleteProductCont)

export default routerProducts