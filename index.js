const express = require('express');
const app = express();

require('dotenv').config();

const PORT=process.env.PORT || 4000;

app.use(express.json());

require("./config/database").connect();

// // route import and mount

const user=require('./routes/user');
app.use('/api/v1',user);


//activation

app.listen(PORT,()=>{
    console.log(`listening on port no : ${PORT}`);
});

app.get('/',(req,res)=>{
    res.send(`<h1>This is HomePage yaar</h1>`);
})