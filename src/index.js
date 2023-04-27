import config from "./config/config.js"
import express from "express";
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import { __dirname } from "./path.js";
import routers from './routes/routes.js'
import passport from "passport";
import initializePassport from "./middleware/passport.js";
import * as path from 'path'


// Port setting
const app = express(); 

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Permite realizar consultas en la URL (req.query)
app.use(cookieParser(config.cookieSecret))

//MONGOOSE (set and connection)
const connectionMongoose = async () => {
  await mongoose.connect(config.urlMongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .catch((err) => console.log(err));
}

connectionMongoose()

//Passport
app.use(passport.initialize())

initializePassport(passport)

//Routers
app.use('/', routers)

//if a URL is invalid display a message
app.use((req, res, next)=> {
  res.status(404).send({error:'Lo siento, no se pudo encontrar la página que estás buscando.'});
});

// Server launch
app.set ("port", config.port || 5000)

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`)
})
