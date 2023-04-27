import passport from 'passport'
import { strategyJWT } from './Strategies/jwtStrategy.js'
import { strategyRegister, strategyLogin } from './Strategies/localStrategy.js'

const initializePassport = () => {
    passport.use(strategyJWT)
    passport.use(strategyRegister)
    passport.use(strategyLogin)
    
}

export default initializePassport