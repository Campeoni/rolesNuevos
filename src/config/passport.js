import local from 'passport-local'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { managerUser } from '../controllers/user.controller.js'
import {managerCarts} from '../controllers/Cart.controller.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { authToken, generateToken } from '../utils/jwt.js'
import config from "./config.js"



//Passport se va a manejar como si fuera un middleware 
const LocalStrategy = local.Strategy //Estretagia local de autenticacion

const JWTStrategy = jwt.Strategy //Estrategia ded JWT
const ExtractJWT = jwt.ExtractJwt //Extractor ya sea de headers o cookies, ect

const initializePassport = () => {
  const cookieExtractor = (req) => {
    //Si existe cookies, verifico si existe mi cookie. Sino se cumple ninguna de las 2 asigno null
    const token = req.cookies ? req.cookies.jwtCookies : null
                              // si no existe la cookie especifica, asigno undefined a token
    return token
  }

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //De donde extraigo mi token
    secretOrKey: config.signedCookie  //Mismo valor que la firma de las cookies
  }, async(jwt_payload, done) =>{
    try {
      return done(null, jwt_payload)
    } catch (error) {
      return done(error)
    }      
  }))

  //Ruta a implementar
  passport.use('register', new LocalStrategy({
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
  }))
  
  passport.use('login', new LocalStrategy({
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
  }))
  
  passport.use('github', new GitHubStrategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: 'http://localhost:4000/authSession/githubSession'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      //console.log("profile github",profile)
      const user = await managerUser.getUserByEmail(profile._json.email)
      
      if (user) { //Usuario ya existe en BDD
        const token = generateToken(user)
        console.log("TOKEN=", token)

        return done(null, user, {token: token})
      } else {
        const passwordHash = createHash('coder123')
        const idCart = await managerCarts.addElements()
        const userCreated = await managerUser.addElements([{
          firstname: profile._json.login,
          lastname: profile._json.html_url,
          email: profile._json.email,
          password: passwordHash, //Contraseña por default ya que no puedo accder a la contraseña de github
          idCart: idCart[0].id
        }])

        const token = generateToken(userCreated)
        console.log("TOKEN=", token)

        return done(null, userCreated, {token: token})
      }
    } catch (error) {
      return done(error)
    }
  }))

  //Iniciar la session del usuario
  passport.serializeUser((user, done) => {
    console.log(user)
    if (Array.isArray(user)) {
      return done(null, user[0]._id)
    }    
    return done(null, user._id)    
  })

  //Eliminar la sesion del usuario
  passport.deserializeUser(async (id, done) => {
    const user = await managerUser.getUserByEmail(id)
    return done(null, user)})
}

export default initializePassport

