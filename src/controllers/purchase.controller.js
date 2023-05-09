import {findTicketById, findTicketByCode, findTicketMaxCode, createTicket } from "../services/ticketService.js";
import {findCartById, deleteProducts } from '../services/cartService.js'
import {updateProduct} from '../services/productService.js'

export const getTicketById = async (req, res) => {  //Recupera todos los productos. puede ser limitado si se informa por URL
  try {
    const tid = req.params.tid    

    const ticket = await findTicketById(tid);

    res.status(200).json(ticket) 

  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
}

export const getTicketByCode = async (req, res) => {  //Recupera todos los productos. puede ser limitado si se informa por URL
  try {
    const code = req.params.code    

    const ticket = await findTicketByCode(code);

    res.status(200).json(ticket) 

  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
}

export const purchaseCart = async (req, res) => { //Inserta nuevo producto
  const cid = req.params.cid
  const mail = req.user.user.email  
  try {      
      let cart = await findCartById(cid);
          cart = await cart.populate('products.productId')

      let result = {}
      let ticket = {}
          
      if (cart.products.length > 0) {

        cart.products.forEach( async(product)=> {
          if ( product.productId.stock >= product.quantity){
            if (ticket.amount) {
              ticket.amount += (product.productId.price * product.quantity)
            } else {
              ticket.amount = (product.productId.price * product.quantity)
            }
            await updateProduct(product.productId.id,{stock:(product.productId.stock - product.quantity)})
          } else {
            if (result.outOfStock) {
              result.outOfStock.push(product.productId)

            } else {
              result.outOfStock = [product.productId]
            }
          }
        })
      } else {
        res.status(200).send("carrito sin productos asociados")
      }
    
      let code = await findTicketMaxCode()
      ticket.code = ++code
      ticket.purchase_email = mail      

      await createTicket(ticket)
      await deleteProducts(cid)
      
      //res.status(200).json(cart.products)
      res.status(200).json(result)
      
  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
}
