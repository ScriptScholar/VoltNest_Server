const express = require("express")
const productController = require("./ProductController")

const productRouter = express.Router()

productRouter.post("/create", productController.createProduct)
productRouter.get("/list", productController.listProduct)
productRouter.post("/filter", productController.filteredProduct)
productRouter.get("/list/:id", productController.getProductByid)
productRouter.put("/update", productController.updateproduct)
productRouter.delete("/delete/:id", productController.deleteProduct)

module.exports = productRouter