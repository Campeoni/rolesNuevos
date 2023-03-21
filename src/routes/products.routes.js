import { Router } from "express";
import { getManagerProducts } from '../dao/daoManager.js'

const routerProducts = Router()

const data = await getManagerProducts();
const managerProducts = new data.ManagerProductDB;


//Recupera todos los productos. puede ser limitado si se informa por URL
routerProducts.get("/", async (req, res) => {
  try {
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
  
    //const products = await managerProducts.getElements(limit);
    
    const products = await managerProducts.paginate(filter, options);
    

    const queryLink = query ? `&query=${query}` : ""
    const limitLink = limit ? `&limit=${limit}` : ""
    const sortLink = sort ? `&sort=${sort}` : ""
    const prevPageLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}${limitLink}${queryLink}${sortLink}` : null
    const nextPageLink = products.hasNextPage ? `/api/products?page=${products.nextPage}${limitLink}${queryLink}${sortLink}` : null
    
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

    res.send(response)

  } catch (error) {
    const responseError = {
      status: "Error", 
      error: error.message
    }

    res.json(responseError) 
  }
});

routerProducts.get("/:pid", async (req, res) => {
  try {      
      const response = {
        status: "Success"
      }

      response.return = await managerProducts.getElementById(req.params.pid)
      res.send(response) 

  } catch (error) {
      const responseError = {
      status: "Error", 
      error: error.message
    }
    res.json(responseError) 
  }
})

routerProducts.post('/', async (req, res) => {
  try {
      const response = {
        status: "Success"
      }

      const product = req.body
      response.return = await managerProducts.addElements(product)
      
      res.send(response)
      
  } catch (error) {
      const responseError = {
      status: "Error", 
      error: error.message
      }
    res.json(responseError) 
  }
})

routerProducts.put('/:pid', async (req, res) => {
  try {
      const response = {
        status: "Success"
      }

      const product = req.body
      await managerProducts.updateElementById(req.params.pid, product)

      res.send(response)

  } catch (error) {
      const responseError = {
      status: "Error", 
      error: error.message
      }
    res.json(responseError) 
  }
})

routerProducts.delete("/:pid", async (req, res) => {
  try {      
      const response = {
        status: "Success"
      }

      response.return = await managerProducts.deleteElementById(req.params.pid)
      res.send(response) 

  } catch (error) {
      const responseError = {
      status: "Error", 
      error: error.message
    }
    res.json(responseError) 
  }
})

export default routerProducts