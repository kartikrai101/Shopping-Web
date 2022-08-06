// in this file we will generate the connection between mongoose and mongoDB using the connection string of the database that you want to connect your mongoose with 

const mongoose = require('mongoose');


const connectDatabase = () => {  // we are making this function so that we can simply call 
    // this function wherever we want to connect with our database
    mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then((data) => {
            console.log(`Mongodb connected with server ${data.connection.host}`)
        }
    )
}
 
module.exports = connectDatabase;

