import express from 'express'
import { addLogger } from './utils/logger.js'

const app = express()
app.use(addLogger)

app.get("/", (req, res) => {
    req.logger.fatal(`${new Date().toLocaleTimeString()} - ERROR FATAL en todas las categorias`)
    req.logger.error(`${new Date().toLocaleTimeString()} - ERROR en categoria Alimentos`)
    req.logger.warning(`${new Date().toLocaleTimeString()} - Warning,  no se encuentro x producto`)
    req.logger.http(`${new Date().toLocaleTimeString()} - http, todo funciona`)
    req.logger.debug(`${new Date().toLocaleTimeString()} - debug, todo funciona`)
    res.send("Probando logger!")
})

app.get("/suma", (req, res) => {
    let suma = 0

    for (let i = 0; i < 10000; i++) {
      suma += i
    }

    res.send(suma)
})


app.listen(4000, () => console.log("Server on Port 4000"))