const axios = require('axios');
const cronJob = require("node-cron");

const BalanceHistory = require('../db/models/BalanceHistory');
const Wallet = require('../db/models/Wallet');

exports.initScheduledJobs = () => {
  const scheduledJobFunction = cronJob.schedule("*/1 * * * *", async () => {
    console.log("Running scheduler!");
    const wallets = await Wallet.find({});
    await Promise.all(wallets.map(async (wallet) => {
        const account = wallet.accountNumber;
        const response = await axios({
            method: "get",
            url: `${process.env.BSC_SCAN_BASE_URL}?module=account&action=balance&address=${account}&apikey=${process.env.BSC_SCAN_TOKEN}`,
          });
        if(response.data.status === '1') {
            await BalanceHistory.create({
                wallet: wallet._id,
                balance: parseInt(wallet.balance),
                accountNumber: wallet.accountNumber,
            });
        
            wallet.balance = parseInt(response.data.result);
            await wallet.save();     
        } else {
            console.log({
                message: "Error in fetching balance data.",
                errorType: "Dummy_type",
            });
        }
    }))
  });

  scheduledJobFunction.start();
}