import config from '../config/config.js';
const seleccionBD = config.dbSelection

export const getManagerMessages = async() => {
  //importo mongodb o importar postgres depende la base de datos
  const modeloMensaje = seleccionBD == 1 
    ? await import('./MongoDB/models/Message.js')  
    : await import('./Postgresql/models/Message.js')     
  return modeloMensaje;
}

export const getManagerProducts = async() => {
  //importo mongodb o importar postgres depende la base de datos
  const modeloProducto = seleccionBD == 1 
    ? await import('./MongoDB/models/Product.js')  
    : await import('./Postgresql/models/Product.js') 
  return modeloProducto;
}

export const getManagerCarts = async() => {
  //importo mongodb o importar postgres depende la base de datos
  const modeloCart = seleccionBD == 1 
    ? await import('./MongoDB/models/Cart.js')  
    : await import('./Postgresql/models/Cart.js') 
  return modeloCart;
}

export const getManagerUsers = async() => {
  //importo mongodb o importar postgres depende la base de datos
  const modeloUser = seleccionBD == 1 
    ? await import('./MongoDB/models/User.js')  
    : await import('./Postgresql/models/User.js') 
  return modeloUser;
}
