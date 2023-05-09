import { Router } from "express";

import routerCarts from './carts.routes.js'
import routerGithub from "./github.routes.js"
import routerGoogle from "./google.routes.js"
import routerProducts from './products.routes.js'
import routerSession from './session.routes.js'
import routerUser from './user.routes.js'

const router = Router()

//Routes
router.use('/api/products', routerProducts)
router.use('/api/carts', routerCarts)
router.use('/api/user', routerUser)
router.use('/api/session', routerSession)
router.use('/authGithub', routerGithub)
router.use('/authGoogle', routerGoogle)

export default router