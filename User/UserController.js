const { httpErrors, httpUAE, JWT_SECRETS, httpSuccess, httpUNF, httpISE } = require("../Contant")
const userModel = require("./UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

class UserController {
    async registerUser(req, res) {
        try {
            const { fullName, email, phone, password } = req.body
            if (!fullName || !email || !phone || !password) throw httpErrors[400]
            const User = await userModel.model.findOne({ phone: phone })
            if (User) return res.status(500).send({ message: httpUAE })
            const encryptedPassword = bcrypt.hashSync(password, 5)
            if (!encryptedPassword) throw httpErrors[500]
            delete req.body.password
            const result = await userModel.model.create({ ...req.body, password: encryptedPassword })
            if (!result) throw httpErrors[500]
            const payload = result._doc
            const token = jwt.sign(payload, JWT_SECRETS, { expiresIn: "30d" })
            if (!token) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, token })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
    async loginUser(req, res) {
        try {
            const { phone, password, role } = req.body
            if (!phone || !password || !role) throw httpErrors[400]
            const User = await userModel.model.findOne({ phone: phone })
            if (!User) return res.status(500).send({ message: httpUNF })
            if (!bcrypt.compareSync(password, User.password)) throw httpErrors[401]
            const payload = User._doc
            const token = jwt.sign(payload, JWT_SECRETS, { expiresIn: "30d" })
            if (!token) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, token })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: httpISE })
        }
    }
}

const userController = new UserController()

module.exports = userController