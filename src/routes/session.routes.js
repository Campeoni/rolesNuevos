import {Router} from "express";
import { testLogin, destroySession } from "../controllers/session.controller.js"

const routerUser = Router();


routerUser.post("/login", testLogin)
routerUser.get("/logout", destroySession)

export default routerUser