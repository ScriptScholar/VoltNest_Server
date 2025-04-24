const { default: mongoose } = require("mongoose");

class AddressModel{
    constructor(){
        this.schema = new mongoose.Schema({
            userId: { type: mongoose.Types.ObjectId, ref: "tbl_users", required: true },
            address:{type:String, required:true},
            area:{type:String, required:true},
            city:{type:String, required:true},
            state:{type:String, required:true},
            pincode:{type:String, required:true, length:6},
        }, {timestamps:true})
        this.model = mongoose.model("tbl_addresses", this.schema)
    }
}


const addressModel = new AddressModel()

module.exports = addressModel