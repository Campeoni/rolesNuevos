import {Router} from "express";
import { testLogin, destroySession } from "../controllers/session.controller.js"
import passport from "passport";
const routerUser = Router();


routerUser.post("/login", passport.authenticate('login'), testLogin)
routerUser.get("/logout", destroySession)

export default routerUser