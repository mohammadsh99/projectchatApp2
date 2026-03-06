//const express = require("express");
//because we use (type: moudle)in package.json  we can use :
import express from "express"; //to do api this  more easy
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv"; // to use config
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config(); // to  can go  to process.env.PORT
//const app = express(); we do it socket.js

const PORT = process.env.PORT;

app.use(express.json()); // this to work this : .body

app.use(cookieParser()); /*
this allow you to parse the cookie 
so you can grab the values out of it 
*/

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes); //authRoutes--> auth.route.jsv
app.use("/api/messages", messageRoutes);

//we repace the app to server we creat
server.listen(PORT, () => {
  console.log("server runing on port:" + PORT);
  connectDB();
});
