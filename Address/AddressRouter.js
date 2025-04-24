const express = require("express")
const addressController = require("./AddressController")

const addressRouter = express.Router()

addressRouter.post("/create", addressController.createAddress)
addressRouter.get("/:userId", addressController.listAddress)
addressRouter.get("/list/:id", addressController.getAddressById)

module.exports = addressRouter