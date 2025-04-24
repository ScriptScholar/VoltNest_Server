const mongoose = require('mongoose');
const { DB_URL } = require('./Contant');

const connectDb = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed", err.message);
        process.exit(1);
    }
};

module.exports = connectDb;