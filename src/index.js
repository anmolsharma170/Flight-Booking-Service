const express = require('express');

const {ServerConfig, Logger, Queue} = require('./config');
const apiRoutes = require('./routes');
const app = express(); 
const CRON = require('./utils/common/cron-jobs');
// express js doesnot know how to read your url body
// so we have to make express to ready body like a json
// aap.use() is going to register middleware for all upcoming routes
app.use(express.json());
app.use(express.urlencoded({extended: true}));  //extended true or false doesnot matter it is just for choosing library 1)query string(false) and 2)qs lib(true)
app.use('/api',apiRoutes);
app.use('/bookingService/api',apiRoutes);
app.listen(ServerConfig.PORT,async ()=>{
    console.log(`Successfully started the server on PORT: ${ServerConfig.PORT}`);
    CRON();
    await Queue.connectQueue();
    console.log("queue connected");
})