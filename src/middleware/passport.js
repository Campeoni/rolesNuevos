import passport from 'passport'
import { strategyRegister, strategyLogin } from './Strategies/localStrategy.js'
import { strategyJWT } from './Strategies/jwtStrategy.js'
import { strategyGithub } from './Strategies/githubStrategy.js'
import { findUserById } from '../services/userService.js';


const initializePassport = () => {
  passport.use(strategyRegister)
  passport.use(strategyLogin)
  passport.use(strategyJWT)
  passport.use(strategyGithub)
  
  //Iniciar la session del usuario
  passport.serializeUser((user, done) => {
    done(null, user._id)
  });

  //Eliminar la sesion del usuario
  passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id)
    done(null, user)
  });
}

export default initializePassport