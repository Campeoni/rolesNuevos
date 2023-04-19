import bcrypt from 'bcrypt'
import config from '../config/config.js'

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(config.salt)))
}

export const validatePassword = (password, storedPassword) => {
    return bcrypt.compareSync(password, storedPassword)
}