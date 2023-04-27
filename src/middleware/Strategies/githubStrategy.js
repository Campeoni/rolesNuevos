import GitHubStrategy from 'passport-github2'
import { findUserByEmail, createUser } from '../../services/userService.js';
import { createCart } from '../../services/cartService.js';
import { createHash } from '../../utils/bcrypt.js'
import { generateToken } from '../../utils/jwt.js'
import config from "../../config/config.js"


const githubOptions = {
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: 'http://localhost:4000/authSession/githubSession'
}


export const strategyGithub = new GitHubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    //console.log("profile github",profile)
    const user = await findUserByEmail(profile._json.email)
    
    if (user) { //Usuario ya existe en BDD
      const token = generateToken(user)
      console.log("TOKEN=", token)
      return done(null, user, {token: token})
    } else {
      const passwordHash = createHash('coder123')
      const idCart = await createCart()
      const userCreated = await createUser([{
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
})



