const dotenv = require("dotenv");
const app = require('./app');
const connectDatabase = require('./config/database');


//handling uncaught exception
process.on("UncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
});


// Config
dotenv.config({path: "backend/config/config.env"});

// connecting to the database (remember to do this after setting the config)
connectDatabase();


const server = app.listen(process.env.PORT, () => {
    console.log("Serving the backend on port 4000!")
});

// Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");

    server.close(() => {
        process.exit(1);
    });
});