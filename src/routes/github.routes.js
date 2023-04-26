import { Router } from "express";
import passport from 'passport'
import { generateToken } from '../utils/jwt.js'

const routerGithub = Router()

// Register
routerGithub.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { 
})

// Login
routerGithub.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    console.log("req.session: ", req.session);
    if (req.session.user) {
        req.session.login = true
        const token = req.authInfo.token
        res
        .cookie('jwtCookies',token,{maxAge: 30000})
        .redirect('/products')
    } else {
        res.redirect('/login')
    }
})

export default routerGithub