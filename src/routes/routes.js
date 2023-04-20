
import { Router } from "express";

import routerProducts from './products.routes.js'
import routerCarts from './carts.routes.js'
import routerUser from './user.routes.js'
import routerRealtimeProducts from './productsWebSocket.routes.js'
import routerHtmlViews from './HtmlViews.routes.js'
import routerChat from './chat.routes.js'
import routerGithub from "./github.routes.js"
import routerSession from './session.routes.js'
import routerPoliticas from "./rutaPrueba_eliminar.routes.js"

const router = Router()

//Routes
router.use('/', routerHtmlViews)
router.use('/api/products', routerProducts)
router.use('/api/carts', routerCarts)
router.use('/api/user', routerUser)
router.use('/api/session', routerSession)
router.use('/realtimeproducts', routerRealtimeProducts)
router.use('/chat', routerChat)
router.use('/authSession', routerGithub)
router.use('/test', routerPoliticas)


export default router