const cors = require("cors");
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const indexRouter = require('./router');
const scheduledFunctions = require('./schedulers/dailyScheduler');

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("Error in connecting to db", err));

app.use(cors());

app.use('/api', indexRouter);

scheduledFunctions.initScheduledJobs();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening on port:" + port);
})

module.exports = app;