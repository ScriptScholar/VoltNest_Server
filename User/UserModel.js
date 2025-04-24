const { default: mongoose } = require("mongoose");

class UserModel {
    constructor(){
        this.schema = new mongoose.Schema({
            fullName:{type:String, required:true},
            email:{type:String, required:true},
            phone:{type:String, required:true, unique:true, length:10},
            password:{type:String, required:true},
            role:{type:Number, required:true, default:0},
        }, {timestamps:true})
        this.model = mongoose.model("tbl_users", this.schema)
    }
}

const userModel = new UserModel()

module.exports=userModel