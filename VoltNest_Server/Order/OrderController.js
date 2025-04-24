const Razorpay = require("razorpay")
const { httpISE, httpErrors, httpSuccess, key_id, key_secrate } = require("../Contant")
const productModel = require("../Product/ProductModel")
const orderModel = require("./OrderModel")
const userModel = require("../User/UserModel")

const razorpay = new Razorpay({ key_id: key_id, key_secret: key_secrate })

class OrderController {
    async createOrder(req, res) {
        try {
            const { userId, products, paymentMethod, totalPrice, totalDiscount, addressId } = req.body
            if (!userId || !products || !paymentMethod || !totalPrice || !totalDiscount || !addressId) throw httpErrors[400]
            const Products = await productModel.model.find({ _id: [...products.map(item => item.id)] })
            if (!Products) throw httpErrors[500]
            const payload = Products.map((product) => {
                const matchedItem = products.find(item => item.id === product._id.toString())
                return {
                    ...product.toObject(),
                    qty: matchedItem?.qty || 1
                };
            })
            const result = await orderModel.model.create({ ...req.body, products: payload })
            if (!result) throw httpErrors[500]
            const create = result._doc
            const billPrice = totalPrice - totalDiscount
            const option = {
                amount: billPrice * 100,
                currency: "INR",
                receipt: create._id,
                payment_capture: 1
            }
            const response = await razorpay.orders.create(option)
            if (!response) throw httpErrors[500]
            const data = {
                ...create,
                razorpayDetails: {
                    ...response,
                    key_id: key_id
                }
            }
            return res.status(200).send({ message: httpSuccess, data: data })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }

    async verifyPayment(req, res) {
        try {
            const { orderId, razorpay_payment_id } = req.body
            const payment = await razorpay.payments.fetch(razorpay_payment_id)
            if (!payment) throw httpErrors[500]
            if (payment.status === "captured" || payment.status === "created" || payment.status === "authorized") {
                await orderModel.model.updateOne({ _id: orderId }, { paymentStatus: "Success" })
                const data = {
                    orderId: orderId,
                    paymentINfo: {
                        email: payment.email,
                        phone: payment.contact
                    }
                }
                return res.status(200).send({ message: httpSuccess, data: data })
            }
            await orderModel.model.updateOne({ _id: orderId }, { paymentStatus: "Reject" })
            throw httpErrors[500]
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }

    async getOrderById(req, res) {
        try {
            const { id } = req.params
            const result = await orderModel.model.findOne({ _id: id }).populate({ path: "addressId" })
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }

    async listOrder(req, res) {
        try {
            const { userId } = req.params
            const user = await userModel.model.findOne({ _id: userId })
            if (user.role === 1) {
                const result = await orderModel.model.find().populate([{ path: "userId" }, { path: "addressId" }])
                if (!result) throw httpErrors[500]
                return res.status(200).send({ message: httpSuccess, data: result })
            }
            const result = await orderModel.model.find({ userId: userId }).populate({ path: "addressId" })
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }

    async updateOrder(req, res) {
        try {
            const { deliveryStatus, orderStatus, id } = req.body
            console.log(req.body)
            if (orderStatus === "Cancelled") {
                const result = await orderModel.model.updateOne({ _id: id }, {
                    paymentStatus: "Reject",
                    paymentMethod: "Null",
                    orderStatus: orderStatus,
                    deliveryStatus: 'Rejected'
                })
                if (!result || result.modifiedCount <= 0) throw httpErrors[500]
            } else {
                if (deliveryStatus === "Dispatch") {
                    const result = await orderModel.model.findOneAndUpdate({ _id: id }, {
                        deliveryStatus: deliveryStatus,
                    })
                    console.log(result, "---Dispatch----")
                    if (!result || result.modifiedCount <= 0) throw httpErrors[500]
                }
                if (deliveryStatus === "Recieved") {
                    const result = await orderModel.model.updateOne({ _id: id }, {
                        deliveryStatus: deliveryStatus,
                        paymentStatus: "Success",
                        orderStatus: orderStatus
                    })
                    console.log(result, "---Completed----")
                    if (!result || result.modifiedCount <= 0) throw httpErrors[500]
                }
            }
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }


    async listOrderByStatus(req, res) {
        try {
            const { orderStatus, userId } = req.body
            const user = await userModel.model.findOne({ _id: userId })
            let result
            if (user.role === 1) {
                result = await orderModel.model.find().populate([{ path: "userId" }, { path: "addressId" }])
            } else {
                result = await orderModel.model.find({ userId: userId }).populate({ path: "addressId" })
            }
            if (orderStatus === "Pending") {
                result = result.filter((item) => item.orderStatus !== "Completed" && item.orderStatus !== "Cancelled")
            } else {
                result = result.filter((item) => item.orderStatus === orderStatus)
            }
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }


    calculateUserScore = async (req, res) => {
        const { userId } = req.params
        const orders = await orderModel.model.find({ orderStatus: "Completed" })
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const userCompletedOrders = orders.filter(order =>
            order.userId.toString() === userId.toString() &&
            order.orderStatus === "Completed" &&
            new Date(order.createdAt).getMonth() === currentMonth &&
            new Date(order.createdAt).getFullYear() === currentYear
        );

        // Sum total amount
        const totalAmount = userCompletedOrders.reduce((sum, order) => {
            return sum + (order.totalPrice || 0);
        }, 0);

        // Score logic
        let score = 0;
        if (totalAmount >= 50000) {
            score = 100;
        } else {
            score = Math.floor((totalAmount / 50000) * 100);
        }

        const data = {
            userId,
            totalAmount,
            score,
            month: currentMonth + 1,
            year: currentYear
        };
        return res.status(200).send({ message: httpSuccess, data: data })
    };

}

const orderContoller = new OrderController()

module.exports = orderContoller