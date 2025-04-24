const { httpErrors, httpISE, httpSuccess } = require("../Contant")
const categoryModel = require("./CategoryModel")

const swc = [
    { name: "Fire-Boltt (Main)", alias: "smartwatch_main_fire-boltt" },
    { name: "Noise (Main)", alias: "smartwatch_main_noise" },
    { name: "boAt (Extra)", alias: "smartwatch_extra_boat" },
    { name: "Amazfit (Extra)", alias: "smartwatch_extra_amazfit" },
    { name: "Realme (Extra)", alias: "smartwatch_extra_realme" },
    { name: "Fastrack (Extra)", alias: "smartwatch_extra_fastrack" }
]

class CategoryController {
    async createCategory(req, res) {
        try {
            const { name, alias } = req.body
            if (!name || !alias) throw httpErrors[400]
            const result = await categoryModel.model.create({ ...req.body })
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }

    async listCategory(req, res) {
        try {
            const result = await categoryModel.model.find()
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }

    async updateCategory(req, res) {
        try {
            const { name, alias, id } = req.body
            if (!name, !alias, !id) throw httpErrors[400]
            const result = await categoryModel.model.updateOne({ _id: id }, { name: name }, { alias: alias })
            if (!result || result.modifiedCount <= 0) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: httpISE })
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params
            const result = await categoryModel.model.deleteOne({ _id: id })
            if (!result || result.deletedCount <= 0) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: httpISE })
        }
    }
}

const categoryController = new CategoryController()

module.exports = categoryController