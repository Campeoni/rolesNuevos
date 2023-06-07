import { Router } from 'express';
import { getProducts, getProduct, postProduct, putProduct, deleteProductCont } from '../controllers/product.controller.js';
import { passportMessage } from "../utils/passportMessage.js";
import { roleVerification } from "../utils/rolVerification.js";
import { roles } from "../utils/dictionary.js";

//"/api/products"
const routerProducts = Router()

routerProducts.route("/")
  .get(getProducts)
  .post(passportMessage('jwt'), roleVerification([roles.admin, roles.premium ]),postProduct)

routerProducts.route("/:pid")
  .get(getProduct)
  .put(passportMessage('jwt'), roleVerification([roles.admin, roles.premium]),putProduct)
  .delete(passportMessage('jwt'), roleVerification([roles.admin, roles.premium]),deleteProductCont)

export default routerProducts