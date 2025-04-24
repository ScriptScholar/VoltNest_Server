const { default: mongoose } = require("mongoose");

class ProductModel {
    constructor() {
        this.schema= new mongoose.Schema({
            title:{type:String,required:true},
            price:{type:Object,required:true},
            rating:{type:Number,required:true},
            numReview:{type:Number,required:true},
            image:{type:mongoose.Types.ObjectId,ref:"tbl_galleries",required:true},
            // image:{type:String,required:true},
            brand:{type:String,required:true},
            category:{type:mongoose.Types.ObjectId,ref:"tbl_categories",required:true},
            discount:{type:Object,required:true},
            content:{type:String},
            Highlight:{type:Array},
        },{timestamps:true})
        this.model=mongoose.model("tbl_products",this.schema)
    }
}
const productModel=new ProductModel

module.exports=productModel