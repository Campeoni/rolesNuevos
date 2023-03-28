
import { Router } from "express";

import routerProducts from './products.routes.js'
import routerCarts from './carts.routes.js'
import routerRealtimeProducts from './productsWebSocket.routes.js'
import routerHtmlViews from './HtmlViews.routes.js'
import routerChat from './chat.routes.js'
import routerSession from './session.routes.js'

const router = Router()

//Routes

router.use('/', routerHtmlViews)
router.use('/session', routerSession)
router.use('/api/products', routerProducts)
router.use('/api/carts', routerCarts)
router.use('/realtimeproducts', routerRealtimeProducts)
router.use('/chat', routerChat)

export default router