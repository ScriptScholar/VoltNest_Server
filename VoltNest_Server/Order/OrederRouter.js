const express = require("express")
const orderContoller = require("./OrderController")

const orderRouter = express.Router()

orderRouter.post("/create", orderContoller.createOrder)
orderRouter.post("/verify/payment", orderContoller.verifyPayment)
orderRouter.get("/list/:id", orderContoller.getOrderById)
orderRouter.get("/:userId", orderContoller.listOrder)
orderRouter.put("/update", orderContoller.updateOrder)
orderRouter.post("/list/status", orderContoller.listOrderByStatus)
orderRouter.get("/score/:userId", orderContoller.calculateUserScore)

module.exports = orderRouter