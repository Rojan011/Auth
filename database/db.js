const mongoose = require("mongoose");
//Now connect to DB

const connectToDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB"));
  } catch (e) {
    console.log("MongoDB connection has failed unfortunately!", e);
    process.exit(1);
  }
};

module.exports = connectToDB;
