import { managerUser } from "./user.controller.js"  //export instance of the user.controller class
import { validatePassword } from "../utils/bcrypt.js"

export const getSession = (req,res) => {
  try {
    if (req.session.login) {
      const sessionData = {
        name: req.session.userFirst,
        role: req.session.role
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
      req.session.role = "admin"
      console.log(`${email} is admin`)
      res.redirect('/products')
    } else {
      const user = await managerUser.getUserByEmail(email)

      if (user && validatePassword(password, user.password)) {
        req.session.login = true
        req.session.userFirst = user.firstname
        req.session.role = user.role
        console.log(`${email} is ${user.role}`)
        //console.table(req.session)        
        res.redirect('/products')
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