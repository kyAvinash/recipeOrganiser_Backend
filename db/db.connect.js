const mongoose = require("mongoose");

// Access your MongoDB connection string from secrets

const MONGODB = "mongodb+srv://ky0avinash:nli4leZSGkekJlZG@cluster0.uboy8.mongodb.net/recipeOrganiser?retryWrites=true&w=majority"

//const mongoURI = process.env.MONGODB;

const mongoURI = MONGODB;

const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log("Connected Successfully");
    }
  } catch (error) {
    console.error("Connection Failed", error);
  }
};

module.exports = { initializeDatabase };
