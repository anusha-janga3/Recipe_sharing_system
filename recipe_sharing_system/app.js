const express=require('express');
const connect=require('./src/config/dbConnect.js');
const router=require('./src/routers/admin2.js');
const path = require('path');
const bodyParser = require('body-parser');
const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);
connect();
app.listen(3030,()=>{
    console.log("server is running");
})