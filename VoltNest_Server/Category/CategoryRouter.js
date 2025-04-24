const express = require("express")
const categoryController = require("./CategoryController")

const categoryRouter = express.Router()

categoryRouter.post("/create", categoryController.createCategory)
categoryRouter.put("/update", categoryController.updateCategory)
categoryRouter.delete("/delete/:id", categoryController.deleteCategory)
categoryRouter.get("/list", categoryController.listCategory)


module.exports = categoryRouter