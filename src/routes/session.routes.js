import { Router } from "express";
import {
  testLogin,
  destroySession,
} from "../controllers/session.controller.js";
import { postUser } from "../controllers/user.controller.js";
import { passportMessage } from "../utils/passportMessage.js";
import { roleVerification } from "../utils/rolVerification.js";
import { roles } from "../utils/dictionary.js";

//"api/session"
const routerUser = Router();

routerUser.route("/register").post(passportMessage("register"), postUser);

routerUser.post("/login", passportMessage("login"), testLogin);

routerUser.get("/logout", destroySession);

routerUser.get("/current",passportMessage("jwt"),roleVerification([roles.user]),
  (req, res) => {
    res.send(req.user);
  }
);

export default routerUser;
