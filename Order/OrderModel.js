const { default: mongoose } = require("mongoose");

class OrderModel {
    constructor() {
        this.schema = new mongoose.Schema({
            userId: { type: mongoose.Types.ObjectId, ref: "tbl_users", required: true },
            addressId: { type: mongoose.Types.ObjectId, ref: "tbl_addresses", required: true },
            products: { type: Array, required: true },
            totalPrice: { type: Number, required: true },
            totalDiscount: { type: Number, required: true, default: 0 },
            paymentMethod: { type: String, required: true },
            paymentStatus: { type: String, required: true, default: "Pending" },
            orderStatus: { type: String, required: true, default: "Pending" },
            deliveryStatus: { type: String, required: true, default: "Pending" },
            deliveryDate: { type: Date, required: true, default: Date.now },
        }, { timestamps: true })
        this.model = mongoose.model("tbl_orders", this.schema)
    }
}

const orderModel = new OrderModel()

module.exports = orderModel