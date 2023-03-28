import { Router } from "express";
import { createUser } from '../controllers/user.controller.js'

const routerUser = Router()

routerUser.route("/")
  .post(createUser)


export default routerUser