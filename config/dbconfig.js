const mongoose = require('mongoose')

require('dotenv').config()

exports.dbconnect = () => {
    mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(function(){
        console.log('Connection is successed!')
    })
    .catch(function(err){
        console.log('Error in db connection')
        console.error(err.message)
        process.exit(1)
    })
}
