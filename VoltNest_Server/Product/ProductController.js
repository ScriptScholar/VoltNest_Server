const { httpErrors, httpISE, httpSuccess } = require("../Contant")
const sampleProducts = require("../Data/ProductData")
const productModel = require("./ProductModel")

const speaker = [
    {
        title: "JBL Go 3 Portable Speaker",
        price: { mrp: 3999, sale: 2999 },
        rating: 4.3,
        numReview: 2100,
        image: "68089e5e7f853723824173b7",
        brand: "JBL",
        category: "68089cf6dbd7a6396019b89c",
        discount: { percentage: 16, label: "Compact Choice" },
        content: "Ultra-portable waterproof speaker with punchy bass.",
        Highlight: ["IP67 Waterproof", "Bluetooth 5.1", "5H Battery"]
    },
    {
        title: "Sony SRS-XB13 Extra Bass",
        price: { mrp: 4990, sale: 3499 },
        rating: 4.5,
        numReview: 1850,
        image: "68089e5e7f853723824173bb",
        brand: "Sony",
        category: "67f8e589ffec6bd6342df9bb",
        discount: { percentage: 7, label: "Deep Bass" },
        content: "Compact speaker with EXTRA BASS and stereo sound.",
        Highlight: ["16H Battery", "IP67 Water & Dustproof", "USB-C Charging"]
    },
    {
        title: "Zebronics Zeb-County",
        price: { mrp: 1299, sale: 899 },
        rating: 4.1,
        numReview: 980,
        image: "68089e5e7f853723824173bd",
        brand: "Zebronics",
        category: "67f8e589ffec6bd6342df9bc",
        discount: { percentage: 12, label: "Budget Pick" },
        content: "Portable speaker with multi-connectivity options.",
        Highlight: ["Bluetooth + AUX", "FM Radio", "USB/SD Card Support"]
    },
    {
        title: "Mivi Play Bluetooth Speaker",
        price: { mrp: 1999, sale: 999 },
        rating: 4.0,
        numReview: 1100,
        image: "68089e5e7f853723824173b9",
        brand: "Mivi",
        category: "67f8e589ffec6bd6342df9be",
        discount: { percentage: 10, label: "Pocket Friendly" },
        content: "Ultra-portable wireless speaker with punchy bass and seamless connectivity.",
        Highlight: ["12H Playtime", "Bluetooth 5.0", "Compact Design", "Made in India"]
    }
]

class ProductController {
    // async insertProduct() {
    //     try {
    //         await productModel.model.insertMany(speaker)
    //         console.log("Added")
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    async createProduct(req, res) {
        try {
            const { title, price, rating, numReview, image, brand, category, discount } = req.body
            if (!title || !price || !rating || !numReview || !image || !brand || !category || !discount) throw httpErrors[400]
            const result = await productModel.model.create({ ...req.body })
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            return res.status(500).send({ message: httpISE })
        }
    }
    async listProduct(req, res) {
        try {
            const result = await productModel.model.find({}, {
                image: true, category: true, price: true, title: true, discount: true,
                content: true, Highlight: true, rating: true, numReview: true, brand: true,
                url: process.env.APP_URL
            }).populate([{ path: "category" }, { path: "image" }])
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: httpISE })
        }
    }
    async deleteProduct(req, res) {
        try {
            const { id } = req.body
            const result = await productModel.model.deleteOne({ _id: id })
            if (!result || result.deletedCount <= 0) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: httpErrors })
        }
    }
    async updateproduct(req, res) {
        try {
            const { title, price, rating, numReview, image, brand, category, discount, id } = req.body
            console.log(req.body)
            if (!title || !price || !rating || !numReview || !image || !brand || !category || !discount || !id) throw httpErrors[400]
            const result = await productModel.model.updateOne({ _id: id }, { title: title, price: price, rating: rating, numReview: numReview, image: image, brand: brand, category: category, discount: discount })
            if (!result || result.updatedCount <= 0) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: httpISE })
        }
    }
    async getProductByid(req, res) {
        try {
            const { id } = req.params
            const result = await productModel.model.findOne({ _id: id }, {
                image: true, category: true, price: true, title: true, discount: true,
                content: true, Highlight: true, rating: true, numReview: true, brand: true,
                url: process.env.APP_URL
            }).populate([{ path: "category" }, { path: "image" }])
            if (!result) throw httpErrors[500]
            // Convert to plain object and append image URL
            const product = result.toObject();

            if (product.image && product.image.path) {
                product.url = `${process.env.APP_URL}${product.image.path}`;
            } else {
                product.url = null;
            }
            return res.status(200).send({ message: httpSuccess, data: product })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: "Internal server error" })
        }

    }

    async filteredProduct(req, res) {
        try {
            const { category, subcategory, itemType } = req.body
            let result = await productModel.model.find({}, {
                image: true, category: true, price: true, title: true, discount: true,
                content: true, Highlight: true, rating: true, numReview: true, brand: true,
                url: process.env.APP_URL
            }).populate([{ path: "category" }, { path: "image" }])
            if (itemType === "main") {
                result = result.filter((x) => x.category.alias.split("_")[1] === "main")
                return res.status(200).send({ message: httpSuccess, data: result })
            }
            if (category) {
                result = result.filter((x) => x.category.alias.split("_")[0] === category)
            }
            if (subcategory) {
                result = result.filter((x) => x.category.alias.split("_")[2] === subcategory)
            }
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: "Internal server error" })
        }
    }
}
const productController = new ProductController

module.exports = productController