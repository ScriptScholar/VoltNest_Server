const { httpISE, httpErrors, httpSuccess } = require("../Contant")
const cartModel = require("./CartModel")

class CartController {
    async addToCart(req, res) {
        try {
            const { userId, productId, qty } = req.body
            if (!userId || !productId || !qty) throw httpErrors[400]
            const cart = await cartModel.model.findOne({ userId: userId, productId: productId })
            if (cart) {
                const totalQty = cart.qty + qty
                const update = await cartModel.model.updateOne({ userId: userId, productId: productId }, { qty: totalQty })
                if (!update || update.modifiedCount <= 0) throw httpErrors[500]
            } else {
                const result = cartModel.model.create({ ...req.body })
                if (!result) throw httpErrors[500]
            }
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
    async listCart(req, res) {
        try {
            const { userId } = req.params
            const result = await cartModel.model.find({ userId: userId }, {
                userId: true,
                productId: true,
                qty: true,
                url: process.env.APP_URL
            }).populate([{ path: "userId" }, { path: "productId", populate: { path: "image" } }])
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
    async deleteCartItems(req, res) {
        try {
            const { id } = req.params
            const result = await cartModel.model.deleteOne({ _id: id })
            if (!result || result.deletedCount <= 0) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
    async emptyUserCart(req, res) {
        try {
            const { userId } = req.params
            const result = await cartModel.model.deleteMany({ userId: userId })
            if (!result || result.deletedCount <= 0) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
}

const cartController = new CartController()

module.exports = cartController