const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "seller"
    },
    shopName: { 
        type: String,
        unique: true,
        required: true
    }
});

moduleexports = mongoose.models.seller || mongoose.model("seller", sellerSchema)  // error in exporting the model