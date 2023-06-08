import { Router } from "express";
import { getUsers, putRolUsers} from '../controllers/user.controller.js'

// "/api/user"
const routerUser = Router()

routerUser.route("/")
  .get(getUsers)

routerUser.route("/premium/:uid")
  .put(putRolUsers)

export default routerUser