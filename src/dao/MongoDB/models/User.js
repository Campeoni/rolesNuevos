import {ManagerMongoDB} from "../db/mongoDBManager.js";
import {Schema} from "mongoose";

const url = process.env.URLMONGODB;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export class ManagerUserDB extends ManagerMongoDB {
  constructor() {
      super(url, "users", userSchema)
  }

  async getUserByEmail(email) {
    super._setConnection()
    try {
        return await this.model.findOne({ email: email })
    } catch (error) {
        return error
    }
  }
}

