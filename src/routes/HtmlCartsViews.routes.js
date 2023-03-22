import { Router } from "express";
import "dotenv/config"

const routerCartsHtmlViews = Router()

const CARTS_URL = `http://localhost:${process.env.PORT || 5000}/api/carts`

routerCartsHtmlViews.get('/carts/:cid', async (req, res) => {
  const response = await fetch(`${CARTS_URL}/${req.params.cid}`)
  const data = await response.json()

  const { status, result } = data

  let products = []
  for (const item of result.products) {
      products.push({
          title: item.productId.title,
          description: item.productId.description,
          price: item.productId.price,
          quantity: item.quantity
      })
  }

  res.render('cartsListHtml', {
      status,
      products,
      cartID: req.params.cid
  });

});

export default routerCartsHtmlViews


