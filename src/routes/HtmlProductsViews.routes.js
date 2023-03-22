import { Router } from "express";
import "dotenv/config"

const routerProductsHtmlViews = Router()

const PRODUCTS_URL = `http://localhost:${process.env.PORT || 5000}/api/products`

routerProductsHtmlViews.get('/products', async (req, res) => {

  let { limit , page, query, sort } = req.query;

  // Creating links to prev and next pages
  const categoryLink = query ? `&query=${query}` : ""
  const limitLink = limit ? `&limit=${limit}` : ""
  const sortLink = sort ? `&sort=${sort}` : ""
  const pageLink = page ? `&page=${page}` : ""

  const response = await fetch(`${PRODUCTS_URL}?${categoryLink}${limitLink}${sortLink}${pageLink}`)
  const data = await response.json()

  const { status, payload, totalPages, prevPage, nextPage, actualPage, hasPrevPage, hasNextPage, prevLink, nextLink } = data  
  
  const booleanStatus = status === "Success" ? true : false

  res.render("productsListHtml", { //Renderizar el siguiente contenido
    titulo: "Ecommerce Backend",    
    booleanStatus,
    payload: payload.map(product => {
      product.thumbnail = `img/${product.thumbnail}`
      return product
    }),
    totalPages,
    prevPage,
    nextPage,
    actualPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink
  })
});

export default routerProductsHtmlViews



