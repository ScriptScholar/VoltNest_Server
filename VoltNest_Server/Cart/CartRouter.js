const express=require("express")
const cartController = require("./CartController")

const cartRouter= express.Router()

cartRouter.post("/create", cartController.addToCart)
cartRouter.get("/:userId", cartController.listCart)
cartRouter.delete("/delete/:id", cartController.deleteCartItems)
cartRouter.delete("/empty/:userId", cartController.emptyUserCart)

module.exports=cartRouter