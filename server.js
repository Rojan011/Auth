require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const app = express();
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes=require("./routes/admin-routes")

//We just invoke the database connection for which we have wrote the logic in other folder
connectToDB();

const PORT = process.env.PORT || 3000;
//using Middelware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);


app.listen(PORT, () => {
  console.log(`Server is now up and running on port ${PORT}`);
});
