const mongoose = require('mongoose')

require('dotenv').config();

exports.connect = () =>{
    mongoose.connect(process.env.DATABASE_URL,{
        // useNewUrlPraser:true,
        // useUnifiedTopology:true
    }).then(()=>{console.log("DB Connection established!!")})
    .catch((error)=>{
        console.log("DB connection faceing Issue");
        console.error(error);
        process.exit(1);
    })
}