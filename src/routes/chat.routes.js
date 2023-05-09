import { Router } from "express";
import { passportError } from "../utils/errorMessages.js";
import { roleVerification } from "../utils/rolVerification.js";

const routerChat = Router()

routerChat.get('/',  passportError('jwt'), roleVerification(['user']), async (req, res) => {  
  res.render("chat", { //Renderizar el siguiente contenido
    titulo: "Chat ecommerce"    
  })
});

export default routerChat