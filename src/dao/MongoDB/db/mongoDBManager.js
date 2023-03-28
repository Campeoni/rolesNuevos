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
    await mongoose.connect(this.#url)
  }

  //Agrego 1 o varios elementos
  async addElements(elements){
    this._setConnection();
    return await this.model.insertMany(elements);
  }

  async getElements(limit){
    this._setConnection();
    return await this.model.find().limit(limit);
  }

  async getElementById(id){
    this._setConnection(); 
    return await this.model.findById(id);
  }

  async updateElementById(id, info){
    this._setConnection();
    return await this.model.findByIdAndUpdate(id, info);
  }

  async deleteElementById(id){
    this._setConnection();
    return await this.model.findByIdAndDelete(id);
  }
}

