import local from 'passport-local'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'

import { managerUser } from '../../controllers/user.controller.js'
import {managerCarts} from '../../controllers/Cart.controller.js'
import { createHash, validatePassword } from '../../utils/bcrypt.js'
import { authToken, generateToken } from '../utils/jwt.js'
import config from "../../config/config.js"


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




