require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-routes")
const homeRoute = require("./routes/home-routes")
const adminRoute = require("./routes/admin-routes")
const uploadImageRoutes = require("./routes/image-routes")


const app = express();

const PORT = process.env.PORT || 3000;
//database connection
connectToDB()
app.use(express.json())

//routes
app.use("/", homeRoute);
app.use("/home", adminRoute);
app.use('/api/auth', authRoutes);
app.use("/api/image", uploadImageRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
});
