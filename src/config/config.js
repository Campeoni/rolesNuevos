import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
  .option('--mode <mode>', "ingrese el modo de trabajo", 'dev')
program.parse()

const enviroment = program.opts().mode

console.log("usted esta en: ", enviroment);

dotenv.config({
  path: enviroment === 'DEV' ? "./.env.dev" : "./.env.prod"
})

export default {
  port: process.env.PORT,
  urlMongoDb: process.env.URLMONGODB,
  dbSelection: process.env.DBSELECTION,  
  cookieSecret: process.env.COOKIE_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  signedCookie: process.env.SIGNED_COOKIE,
  salt: process.env.SALT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
}
