import jwt from "jsonwebtoken"
import config from "../config/config.js"


export const generateToken = (user) => {
  /*
    1er: Objeto de asociacion del token
    2do: Clave privada del cifrado
    3er: Tiempo de expiracion
  */
  const token = jwt.sign({user}, config.signedCookie, {expiresIn:'24h'})
  return token
}

export const authToken = (req, res, next) => {
  //Consultar en el header el token
  const authHeader = req.headers.authoritation
  
  if(!authHeader){ //Token no existe o expirado
    return res.status(401).send({error: "Usuario no autenticado"})
  }

  //Sacar la palabra Bearer del token
  const token = authHeader.split('')[1]

  //Validar si el token es valido o no
  jwt.sign(token, config.signedCookie, (error, Credential)=>{

    if(error){ //Validar si el token fue adulterado
      return res.status(403).send({error: "usuario no autorizado"})
    }

    //Token existe y valido
    req.user = Credential.user
    
    next()
  })
}