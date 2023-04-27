import passport from "passport"


export const passportError = (strategy) =>{ //valida con JSONWebToken
  return async(req,res,next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) { //Errores del Token (Token no valido, no posee el formato adecuado o no existe )
        return next(error)
      }

      if (!user){ // No existe usuario
        return res.status(401).send({error: info.message ? info.message : info.toString()})
      }
      
      req.user = user //Si todo salio bien seteo el usuario 
      return next()

    }) (req, res, next)
  }
}

export const roleVerification = (roles) => {
  let bandera = 0
  return async (req, res, next) => {
      
    let userAccess = {}
    if (req.user.user[0]) {
      userAccess = req.user.user[0]
    } else{
      userAccess = req.user.user
    }

      if (!req.user) {
          return res.status(401).send({ error: "User no autorizado" })
      }
      roles.forEach(rolEnviado => {
          if (userAccess.rol != rolEnviado) { //El user no tiene el rol necesario a esta ruta y a este rol
              return bandera = 1              
          }
      });

      if (bandera == 1) {
          return res.status(401).send({ error: "User no posee los permisos necesarios" })
      }
      
      next()

  }

} 