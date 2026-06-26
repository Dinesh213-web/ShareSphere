const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({

    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
        required: true
    },

    borrowerRollNumber: {
        type: String,
        required: true
    },

    ownerRollNumber: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("Borrow", borrowSchema);
