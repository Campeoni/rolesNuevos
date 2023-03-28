import {Router} from "express";
import {getSession, testLogin, destroySession } from "../controllers/session.controller.js"

const routerUser = Router();


routerUser.post("/testLogin", testLogin)
routerUser.get("/logout", destroySession)

export default routerUser