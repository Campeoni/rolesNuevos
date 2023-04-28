import { paginateProducts, findProductById, createProduct, updateProduct, deleteProductServ  } from "../services/productService.js";

            
export const getProducts = async (req, res) => {  //Recupera todos los productos. puede ser limitado si se informa por URL
  const ValidSort = ['asc', 'desc']

  let { limit , page, query, sort } = req.query;
  
  let sortOption = sort

  const filter = { stock: { $gt: 0 } } // Filtro Mongodb para traer productos con stock > 0
  query && (filter.category = query)
      
  limit || (limit = 10)  
  page  || (page  =  1)

  if (ValidSort.includes(sort)){
    sort === "asc" 
      ? sortOption = "price"
      : sortOption = "-price"

  } else if (sort !== undefined) {
    throw `Parametro invalido en el SORT: "${sort}", solo admite "asc" ó "desc"`
  }

  const options = { //Setea opciones
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOption
  };
  
  try {
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
    res.status(500).json({
      message: error.message
    }) 
  }
}

export const postProduct = async (req, res) => { //Inserta nuevo producto
  const product = req.body  
  try {      
      const response = await createProduct(product)
      
      res.status(200).json(response)
      
  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
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
  
  try {      
      const response  = await updateProduct(pid, product)

      if (response) {
        const response  = await findProductById(pid)
        res.status(200).json(response)         
      } else {
        res.status(200).json("No existe ningun producto con ese ID para actualizar") 
      }
  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
}

export const deleteProductCont = async (req, res) => { // Delete Product
  const pid = req.params.pid
  
  try {      
      const response = await deleteProductServ(pid)

      if (response) {
        res.status(200).json({
          delete: true,
          message: "Producto eliminado"}) 
      } else {
        res.status(200).json({
          delete: false,
          message: "No existe ningun producto con ese ID para eliminar"}) 
      }
  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
}