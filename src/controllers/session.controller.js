import { findUserByEmail } from '../services/userService.js'  //export instance of the user.controller class
import { validatePassword } from '../utils/bcrypt.js'
import { generateToken } from '../utils/jwt.js'

export const getSession = (req,res) => {
  try {
    if (req.session.login) {
      const sessionData = {}
            
      if (req.session.userFirst) {
        sessionData.name= req.session.userFirst
        sessionData.rol= req.session.rol
      } else {
        sessionData.name= req.session.user.firstname
        sessionData.rol= req.session.user.rol      
      }
      return sessionData
    } else {
      res.redirect('/login', 500, { message: "Logueate para continuar" })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const testLogin = async (req,res) => {
  try {    
    const { email, password } = req.body

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.login = true
      req.session.userFirst = "Admin Coder"
      req.session.rol = "admin"
      console.log(`${email} is ${user.rol}d`)
      res.redirect('/products')
    } else {
      const user = await findUserByEmail(email)

      if (user && validatePassword(password, user.password)) {
        req.session.login = true
        req.session.userFirst = user.firstname
        req.session.rol = user.rol
        console.log(`${email} is ${user.rol}`)
        console.table(req.session)  
        const token = generateToken(user)

        return res
          .cookie('jwtCookies',token,{maxAge: 30000 , httpOnly: true} ) // setea la cookie
          .status(200)
          .json({token})//muestra el token

      } else {
        res.status(401).json({
          message: "User or password incorrect"
        })
      }    
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const destroySession = (req, res) => {
  try {
    if (req.session.login) {
      req.session.destroy()
      console.log(`Session closed`)
    }
    
    res.status(200).redirect('/')  
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const requireAuth = (req, res, next) => {
  //console.table(req.session)
  req.session.login ? next() : res.redirect('/login')
}