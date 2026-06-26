const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    condition: {
        type: String,
        required: true
    },

    ownerRollNumber: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Available"
    },

    image: {
        type: String,
        default: ""
    }

}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);