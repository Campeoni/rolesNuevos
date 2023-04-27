import local from 'passport-local'
import { managerUser } from '../../controllers/user.controller.js'
import {managerCarts} from '../../controllers/Cart.controller.js'
import { createHash, validatePassword } from '../../utils/bcrypt.js'
import { authToken, generateToken } from '../utils/jwt.js'



//Passport se va a manejar como si fuera un middleware 
const LocalStrategy = local.Strategy //Estretagia local de autenticacion

  //Ruta a implementar
export const strategyRegister = new LocalStrategy({
    passReqToCallback: true, 
    usernameField: 'email'
  }, async (req, username, password, done) => {
    //Validar y crear Usuario
    const { firstname, lastname, email } = req.body
    try {
      const user = await managerUser.getUserByEmail(username) //Username = email

      if (user) { //Usario existe
        return done(null, false) //null que no hubo errores || false que no se creo el usuario
      }
      const passwordHash = createHash(password)
      const idCart = await managerCarts.addElements()
      const userCreated = await managerUser.addElements([{
        firstname: firstname,
        lastname: lastname,        
        email: email,
        password: passwordHash, 
        idCart: idCart[0].id
      }])      
      
      console.log("nunca se esta devolviendo TOKEN, ver si queda")
      const token = generateToken(userCreated)
      
      console.log("TOKEN=", token)

      return done(null, userCreated) //Usuario creado correctamente

    } catch (error) {
      return done(error)
    }
  }
)
  
export const strategyLogin =  new LocalStrategy({
    usernameField: 'email' 
  }, async (username, password, done) => {
    try {
      const user = await managerUser.getUserByEmail(username)

      if (!user) { //Usuario no encontrado
        return done(null, false)
      }
      if (validatePassword(password, user.password)) { //Usuario y contraseña validos
        console.log("nunca se esta devolviendo TOKEN, ver si queda")
        const token = generateToken(user)
        console.log("TOKEN=", token)
        return done(null, user)
      }
      return done(null, false) //Contraseña no valida

    } catch (error) {
      return done(error)
    }
  }
)
