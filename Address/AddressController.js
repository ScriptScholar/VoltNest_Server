const { httpISE, httpSuccess, httpErrors } = require("../Contant")
const addressModel = require("./AddressModel")

class AddressController {
    async createAddress(req, res) {
        try {
            const { address, area, city, state, pincode, userId } = req.body
            if (!address || !area || !city || !state || !pincode || !userId) throw httpErrors[400]
            const result = await addressModel.model.create({ ...req.body })
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
    async listAddress(req, res) {
        try {
            const { userId } = req.params
            const result = await addressModel.model.find({ userId: userId })
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
    async getAddressById(req, res) {
        try {
            const { id } = req.params
            const result = await addressModel.model.findOne({ _id: id })
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
}

const addressController = new AddressController()


module.exports = addressController