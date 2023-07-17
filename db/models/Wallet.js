const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    accountNumber: {
        type: String,
    },
    balance: {
        type: Number,
    },
},
{
    timestamps: true,
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;