const dotenv = require("dotenv");
const app = require('./app');
const connectDatabase = require('./config/database');


// Config
dotenv.config({path: "backend/config/config.env"});

// connecting to the database (remember to do this after setting the config)
connectDatabase()


app.listen(process.env.PORT, () => {
    console.log("Serving the backend on port 4000!")
})