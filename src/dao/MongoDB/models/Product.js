import {ManagerMongoDB} from "../../../db/mongoDBManager.js";
import {Schema} from "mongoose"

const url = process.env.URLMONGODB;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
      type: String,
      required: true
  },
  price: {
      type: Number,
      required: true
  },
  code: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9]$/
  },
  status: {
      type: Boolean,
      default: true
  },
  stock: {
      type: Number,
      required: true
  },
  category: {
      type: String,
      required: true
  },
  thumbnail: {
      type: Array,
      default: [""]
  }
})

export default class ManagerProductMongoDB extends ManagerMongoDB{
  constructor() {
    super(url, "products", productSchema)
  }
}