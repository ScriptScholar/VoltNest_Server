const { default: mongoose } = require("mongoose");

class CartModel {
    constructor() {
        this.schema = new mongoose.Schema({
            userId: { type: mongoose.Types.ObjectId, ref: "tbl_users", required: true },
            productId: { type: mongoose.Types.ObjectId, ref: "tbl_products", required: true },
            qty:{type:Number, required: true, default:1}
        }, { timestamps: true })
        this.model = mongoose.model("tbl_carts", this.schema)
    }
}

const cartModel = new CartModel()

module.exports = cartModel