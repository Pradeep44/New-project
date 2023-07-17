const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const balanceHistorySchema = new Schema({
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    balance: {
        type: Number,
    },
    accountNumber:{
        type: String,
    },
},
{
    timestamps: true,
});

const BalanceHistory = mongoose.model('BalanceHistory',balanceHistorySchema);

module.exports = BalanceHistory;