module.exports = {
    PORT: 5000,
    APP_URL: "http://192.168.1.2:5000",
    DB_URL: "mongodb+srv://scriptscholartech:A0uFDRw9faIfyO0C@voltnest.qp8rtqw.mongodb.net/VoltNest",
    // DB_URL: "mongodb://127.0.0.1:27017/VoltNest",
    JWT_SECRETS: "JWT_SECRETS",
    key_id: "rzp_test_oYzCquEuAY3r9N",
    key_secrate: "UOQTdhf1aVVuZwg8Nxf2yDc8",
    httpSuccess: "Success",
    httpErrors: {
        500: (() => {
            const err = new Error("Somthing went wrong")
            err.status = 500
            return err
        })(),
        400: (() => {
            const err = new Error("Missing dependency")
            err.status = 400
            return err
        })(),
        401: (() => {
            const err = new Error("unAuthorized")
            err.status = 401
            return err
        })(),
        200: (() => {
            const err = new Error("Success")
            err.status = 200
            return err
        })()
    },
    httpISE: "Intrenal Server Error",
    httpUNF: "User Not Found",
    httpUAE: "User Alredy Exist",
    key_id: "rzp_test_oYzCquEuAY3r9N",
    key_secrate: "UOQTdhf1aVVuZwg8Nxf2yDc8",
    paymentMethod: ["COD", "Online", "Null"],
    paymentStatus: ["Pending", "Success", "Reject"],
    orderStatus: ["Pending", "Completed", "Cancelled"],
    deliveryStatus: ["Pending", "Dispatch", "Recieved", "Rejected"],
    role: ["User", "Admin"]
}


