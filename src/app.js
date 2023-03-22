import express, { application } from "express";
import { __dirname } from "./path.js";
import * as path from 'path'
import multer from 'multer'
import { engine } from 'express-handlebars';
import {Server} from "socket.io";
import "dotenv/config"
import { getManagerMessages } from "./dao/daoManager.js";

//rutas
import routerProducts from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import routerRealtimeProducts from './routes/productsWebSocket.routes.js'
import routerProductsHtmlViews from './routes/HtmlProductsViews.routes.js'
import routerCartsHtmlViews from './routes/HtmlCartsViews.routes.js'
import routerChat from './routes/chat.routes.js'

// Configurar Multer para almacenar los archivos subidos en el servidor
const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb(null, __dirname + '/public/img')
  },
  filename: (req, file, cb) => {
    console.log("nombre= ", file.originalname);
    cb(null, file.originalname);
  }
} );

// Inicializar Multer con la configuración de almacenamiento
const upload = multer({ storage });

const app = express(); 

app.set ("port", process.env.PORT || 5000)

const server = app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`)
})

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Permite realizar consultas en la URL (req.query)

//configuracion HandleBars
app.engine('handlebars', engine());   //configuración del motor de express
app.set('view engine', 'handlebars'); //indica que usaremos el motor de vista handlebars
app.set('views', path.resolve(__dirname, './views')); //__dirname + './views'

//ServerIO
const io = new Server(server)

const data = await getManagerMessages();    
const managerMessage = new data.ManagerMessageDB;
//Conexion Server SocketIo
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

//Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/', routerProductsHtmlViews)
app.use('/', routerCartsHtmlViews)
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)
app.use('/realtimeproducts', routerRealtimeProducts)
app.use('/chat', routerChat)


app.post('/upload', upload.single('file'), (req,res) =>{
  res.send("imagen cargada")
})

//si una URL no es valida mostramos un mensaje
app.use(function(req, res, next) {
  res.status(404).send('Lo siento, no se pudo encontrar la página que estás buscando.');
});