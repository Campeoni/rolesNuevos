import { Router } from "express";
import "dotenv/config"

const routerProductsHtmlViews = Router()

const PRODUCTS_URL = `http://localhost:${process.env.PORT || 5000}/api/products`
const CARTS_URL = `http://localhost:${process.env.PORT || 5000}/api/carts`


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
})

routerProductsHtmlViews.get('/Carts/:cid', async (req, res) => {
  const response = await fetch(`${CARTS_URL}/${req.params.cid}`)
  const data = await response.json()

  const {products } = data

  let auxProducts = []

  if (products?.length > 0){
    for (const item of products) {
      auxProducts.push({
        title: item.productId.title,
        description: item.productId.description,
        price: item.productId.price,
        quantity: item.quantity
      })
    }
  } 

  res.render('cartsListHtml', {
      auxProducts,
      cartID: products?.length > 0 ? req.params.cid : "No existe"
  })
})

export default routerProductsHtmlViews



