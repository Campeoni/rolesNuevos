import {ManagerMongoDB} from "../db/mongoDBManager.js";
import {Schema} from "mongoose"
import config from "../../../config/config.js";

const url = config.urlMongoDb;

const messageSchema = new Schema({
  name: String, 
  email: {
    type: String, 
    unique: true
  },
  message: String
})

export class ManagerMessageDB extends ManagerMongoDB{
  constructor() {
    super(url, "messages", messageSchema)
  }  
}