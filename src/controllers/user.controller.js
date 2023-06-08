import { findUsers, findUserById, updateRol  } from '../services/userService.js';
import { roles } from "../utils/dictionary.js";

export const getUsers = async (req, res) => {
  try {
      const users = await findUsers()
      res.status(200).json({users})

  } catch (error) {
      res.status(500).send({
        message: "Hubo un error en el servidor", 
        error: error.message
      })
  }
}
export const putRolUsers = async (req, res) => {  //Modifica el rol del usuario 
  const uid = req.params.uid
  let newRol = ""

  try {
      const user = await findUserById(uid)

      if (user){
        
        if (user.rol === roles.premium ){
          newRol = roles.user
        } else {
          newRol = roles.premium
        }

        await updateRol(uid,newRol)

        res.status(200).json("The user roles have been modified")

      }else {
        res.status(200).json("User does not exist")  
      }

  } catch (error) {
      res.status(500).send({
        message: "Hubo un error en el servidor", 
        error: error.message
      })
  }
}

export const postUser = async (req, res) => {
  res.send({status: "success", message: "User Created"})
}

