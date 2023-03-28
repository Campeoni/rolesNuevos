import { getManagerUsers } from "../dao/daoManager.js";
import { createHash } from "../utils/bcrypt.js";

const data = await getManagerUsers()
export const managerUser = new data.ManagerUserDB

export const createUser = async (req, res) => {
  const { firstname, lastname, username, email, password, role } = req.body

  try {
    const user = await managerUser.getUserByEmail(email)
    if (user) {
      res.status(400).json({
          message: "User registered"
      })
    } else {
      const hashPassword = createHash(password)

      const createdUser = await managerUser.addElements({
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          password: hashPassword,
          role: role
      })

      res.status(200).json({
          message: "User created",
          createdUser
      })
    }

  } catch (error) {
      res.status(500).json({
          message: error.message
      })
  }
}

