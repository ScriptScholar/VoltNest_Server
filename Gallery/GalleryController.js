const { httpErrors, httpISE, httpSuccess, APP_URL } = require("../Contant")
const productModel = require("../Product/ProductModel")
const galleryModel = require("./GalleryModel")
const randString = require("randomstring")


class GalleryController {
    async uploadFile(req, res) {
        try {
            const file = req.files.file
            for (let i = 0; i < file.length; i++) {
                let fileName = randString.generate({ length: 8, charset: "alphabetic" })
                let ext = file[i].name.split(".")
                let title = ext[0]
                ext = ext[ext.length - 1]
                fileName += "."
                fileName += ext
                let filePath = "/public/" + fileName
                file[i].mv("." + filePath)
                const result = await galleryModel.model.create({ name: fileName, path: filePath, title: title })
                if (!result) throw httpErrors[500]
            }
            return res.status(200).send({ message: httpSuccess })
        } catch (error) {
            console.log(error);
            return res.status(200).send({ message: httpISE })
        }
    }
    async listGallery(req, res) {
        try {
            const result = await galleryModel.model.find({}, {
                name: true,
                title: true,
                _id: true,
                path: true,
                url: { $concat: [APP_URL, "$path"] }
            }).sort({ "createdAt": -1 })
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: httpISE })
        }
    }
    async deleteGallery(req, res) {
        try {
            const { id } = req.parans
            const find = await galleryModel.model.findOne({ _id: id })
            if (!find) throw httpErrors[500]
            const result = await galleryModel.model.deleteOne({ _id: id })
            if (!result || result.deletedCount <= 0) throw httpErrors[500]
            const fileName = find.path
            if (!fileName) throw httpErrors[500]
            await GalleryController.unlinkPromise(fileName)
            throw httpErrors[200]
        } catch (error) {
            console.log(error);
            throw httpErrors[500]
        }
    }
    static unlinkPromise(file) {
        return new Promise((resolve, reject) => {
            fs.unlink("." + file, (error) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            })
        })
    }

    async modifiProduct() {
        try {
            const products = await productModel.model.find({}, { _id: 1 });
            const images = await galleryModel.model.find({}, { _id: 1 });

            const minLength = Math.min(products.length, images.length);

            for (let i = 0; i < minLength; i++) {
                const productId = products[i]._id;
                const imageId = images[i]._id;

                await productModel.model.updateOne(
                    { _id: productId },
                    { $set: { image: imageId } } // Ensure your schema has this field
                );
            }

            console.log(`Updated ${minLength} products with corresponding image IDs.`);
        } catch (error) {
            console.error("Error in modifiProduct:", error);
        }
    }

}
const galleryController = new GalleryController()

module.exports = galleryController