import mongoose from "mongoose";

export class ManagerMongoDB {
  #url

  constructor(url, collection, schema) {
    this.#url = url; //Atributo privado
    this.collection = collection;
    this.schema = schema;     
    //this.schema = new mongoose.Schema(schema);      
    this.model = mongoose.model(this.collection, this.schema);
  }

  //metodo statico
  async _setConnection() {
    try {      
      await mongoose.connect(this.#url)
      console.log("MongoDB is connected!");
      } catch (error) {
      return error
    }
  }

  //Agrego 1 o varios elementos
  async addElements(elements){
    this._setConnection();
    try{  
      return await this.model.insertMany(elements)
    } catch(error) {
      return error
    }
  }

  async getElements(limit){
    this._setConnection();
    try{  
      return await this.model.find().limit(limit)
    } catch(error) {
      return error
    }
  }
  async getElementById(id){
    this._setConnection();
    try{  
      return await this.model.findById(id)
    } catch(error) {
      return error
    }
  }
  async updateElementById(id, info){
    this._setConnection();
    try{  
      return await this.model.findByIdAndUpdate(id, info)
    } catch(error) {
      return error
    }
  }
  async deleteElementById(id){
    this._setConnection();
    try{  
      return await this.model.findByIdAndDelete(id)
    } catch(error) {
      return error
    }
  }
}

