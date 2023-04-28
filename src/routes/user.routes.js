import { Router } from "express";
import { getUsers } from '../controllers/user.controller.js'
import passport from "passport";

// "/api/user"
const routerUser = Router()

// ver si se puede meter el middleware con route

/* routerUser.route("/register")
  .post(passport.authenticate('register'), createUser)  */
  
routerUser.route("/")
  .get(getUsers)

//routerUser.post("/register", passport.authenticate('register') ,createUser )


export default routerUser