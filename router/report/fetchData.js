const mongoose = require('mongoose');

const BalanceHistory = require('../../db/models/BalanceHistory');
const Wallet = require('../../db/models/Wallet');

const { getChangeInPercent } = require('../../functions');

module.exports = async function( req, res) {
    let format = '%d-%m-%Y';
    if(req.query.type) {
        if(req.query.type === 'monthly') {
            format = '%m-%Y'
        } else  if(req.query.type === 'weekly') {
            format = '%U-%Y'
        } 
    }
    try {
        const wallets = await Wallet.find({});
        const data = await Promise.all(wallets.map(async (wallet) => {
            const report = await BalanceHistory.aggregate([
                {
                    $match: {
                        wallet: new mongoose.Types.ObjectId(wallet.id),
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: format, date: '$createdAt' } },
                        amount: {
                            $avg: '$balance',
                        },
                        accountNumber: { $first: '$accountNumber'},
                    }
                },
                {
                    $project: {
                        _id: '$accountNumber',
                        date: '$_id',
                        amount: '$amount',
                    }
                }
            ]);

            const temp = report.map(item => {
                return {
                accountNumber: item._id,
                data: item.date,
                amount: item.amount,
                changeInPercent: getChangeInPercent(wallet.balance, item.amount),
                };
            });

            return temp;
        }))

        return res.status(200).json({ data });
    } catch(error) {
        console.log(error);
        return res.status(500).send('error in fetching data', error);
    }
}