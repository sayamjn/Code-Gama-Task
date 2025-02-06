const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    defaultCurrency: {
        type: String,
        default: "USD",
        enum: ['USD', 'EUR', 'GBP', 'JPY']
    },
    dailyTransactionTotal: {
        type: Number,
        default: 0,
    },
    lastTransactionReset: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre("save", async function (next) {

    if (!this.isModified(this.password)) return next();
    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.methods.comparePassword = async function (candidtaePassword) {
    return await bcrypt.compare(candidtaePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
