import { paginateProducts, findProductById, createProduct, updateProduct, deleteProductServ  } from "../services/productService.js";
import CustomError from '../utils/erroresHandler/CustomError.js'
import {EErrors} from '../utils/erroresHandler/enums.js'
import {invalidSortErrorInfo, generateProductErrorInfo} from '../utils/erroresHandler/info.js'
import { roles } from "../utils/dictionary.js";
            
export const getProducts = async (req, res, next) => {  //Recupera todos los productos. puede ser limitado si se informa por URL
  const ValidSort = ['asc', 'desc']

  let { limit , page, query, sort } = req.query;
  
  let sortOption = sort

  const filter = { stock: { $gt: 0 } } // Filtro Mongodb para traer productos con stock > 0
  query && (filter.category = query)
      
  limit || (limit = 10)  
  page  || (page  =  1)

  
  const options = { //Setea opciones
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOption
  };
  
  try {
    if (ValidSort.includes(sort)){
      sort === "asc" 
        ? sortOption = "price"
        : sortOption = "-price"
  
    } else if (sort !== undefined) {
      CustomError.createError({
        name: "invalid parameter",
        cause: invalidSortErrorInfo(sort),
        message: "invalid parameter in sort",
        code: EErrors.ROUTING_ERROR
      })
    }

    const products = await paginateProducts(filter, options);
    const queryLink = query ? `&query=${query}` : ""
    const limitLink = limit ? `&limit=${limit}` : ""
    const sortLink = sort ? `&sort=${sort}` : ""
    const prevPageLink = products.hasPrevPage ? `?page=${products.prevPage}${limitLink}${queryLink}${sortLink}` : null
    const nextPageLink = products.hasNextPage ? `?page=${products.nextPage}${limitLink}${queryLink}${sortLink}` : null
    
    const response = {
      status: "Success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevPageLink,
      nextLink: nextPageLink
    }  

    res.status(200).json(response)

  } catch (error) {
    next(error)
  }
}

export const postProduct = async (req, res, next) => { //Inserta nuevo producto
  const product = req.body  
  try {      
      if(!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category)  {
        CustomError.createError({
          name: "Product creation error",
          cause: generateProductErrorInfo(product),
          message: "Error Trying create Product",
          code: EErrors.ROUTING_ERROR
        })
      }  

      if(req.user.user.rol === roles.premium){
        product.owner = {
          rol: roles.premium ,
          userId: req.user.user._id
        };
      }

      const response = await createProduct(product)      
      res.status(200).json(response)
      
  } catch (error) {
    next(error)
  }
}

export const getProduct = async (req, res) => { //Recupera 1 producto
  const pid = req.params.pid
  try {      
      const response  = await findProductById(pid)

      res.status(200).json(response) 

  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
}

export const putProduct = async (req, res) => { // Modifica 1 producto
  const pid = req.params.pid
  const product = req.body
  let updateFlag = true
  
  try {      
    if (req.user.user.rol === roles.premium){
      const product  = await findProductById(pid)

      const rolFlag = product?.owner.rol === roles.premium ?  true : false
      const userFlag = product?.owner.userId === req.user.user._id ?  true : false
      

      if (!(rolFlag && userFlag) ){
        updateFlag = false
      }
    }
    if (updateFlag){
      const response  = await updateProduct(pid, product)

      if (response) {
        const response  = await findProductById(pid)
        res.status(200).json(response)         
      } else {
        res.status(200).json("No existe ningun producto con ese ID para actualizar") 
      }
    } else {
      res.status(200).json({
        delete: false,
        message: "access denied to update the product"}) 
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
}

export const deleteProductCont = async (req, res) => { // Delete Product
  const pid = req.params.pid
  let deleteFlag = true
  
  try {      
    if (req.user.user.rol === roles.premium){
      const product  = await findProductById(pid)

      const rolFlag = product?.owner.rol === roles.premium ?  true : false
      const userFlag = product?.owner.userId === req.user.user._id ?  true : false
      

      if (!(rolFlag && userFlag) ){
        deleteFlag = false
      }
    }

    if (deleteFlag){
      const response = await deleteProductServ(pid)
      
      if (response) {
        res.status(200).json({
          delete: true,
          message: "Product deleted"}) 
        } else {
          res.status(200).json({
            delete: false,
            message: "there is no product with this ID to be removed"}) 
          }
    } else {
      res.status(200).json({
        delete: false,
        message: "access denied to remove the product"}) 
    }

  }
  catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
}
