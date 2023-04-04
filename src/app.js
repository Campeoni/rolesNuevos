import "dotenv/config"
import express, { application } from "express";
import { engine } from 'express-handlebars';
import {Server} from "socket.io";
import { __dirname } from "./path.js";
import * as path from 'path'
import cookieParser from 'cookie-parser'
import session from 'express-session';
import MongoStore from 'connect-mongo'
import routers from './routes/routes.js'
import passport from "passport";
import initializePassport from "./config/passport.js";

import { getManagerMessages } from "./dao/daoManager.js";

// Port setting
const app = express(); 

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Permite realizar consultas en la URL (req.query)
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.URLMONGODB,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 90
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Public folder
app.use('/', express.static(__dirname + '/public'))

//Routers
app.use('/', routers)

//if a URL is invalid display a message
app.use(function(req, res, next) {
  res.status(404).send('Lo siento, no se pudo encontrar la página que estás buscando.');
});

//HandleBars Configuration
app.engine('handlebars', engine());   //configuración del motor de express
app.set('view engine', 'handlebars'); //indica que usaremos el motor de vista handlebars
app.set('views', path.resolve(__dirname, './views')); //__dirname + './views'


// Server launch
app.set ("port", process.env.PORT || 5000)

const server = app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`)
})

//ServerIO
const io = new Server(server)

const data = await getManagerMessages();    
const managerMessage = new data.ManagerMessageDB;

//SocketIo Server Connection
io.on("connection", async (socket)=> {  
  console.log("cliente socket conectado!");  
  
  socket.on("loadMessage", async () => {
    const textMessage = await managerMessage.getElements()
    socket.emit("pushMessage", textMessage)
  })
  
  socket.on("addMessage", async (newMessage) => {
    await managerMessage.addElements([newMessage])  

    const textMessage = await managerMessage.getElements()    
    socket.emit("pushMessage", textMessage)
  })

})


