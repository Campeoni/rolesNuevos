import {Router} from "express";
import { testLogin, destroySession } from "../controllers/session.controller.js"
import passport from "passport";
import { passportError, roleVerification } from "../utils/errorMessages.js";

//"api/session"
const routerUser = Router();

routerUser.post("/login", passport.authenticate('login'), testLogin)
routerUser.get("/logout", destroySession)

routerUser.get("/current", passportError('jwt'), roleVerification(['user']), (req, res) => {
  res.send(req.user)
})

export default routerUser