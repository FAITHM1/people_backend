///////////////////////
// Dependencies
/////////////////////////
//get .env variables
require("dotenv").config();
///pull port from .env give it a default of 3000 (object destructing)
const { PORT = 3000, DATABASE_URL } = process.env;
//import express
const express = require("express");
//create the application object
const app = express();
// IMPORT MONGOOSE
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan");
////////////////////////////////////////////
//Database connection
//////////////////////////////////
//establish connection
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
///conection Events

mongoose.connection
  .on("open", () => console.log("You are connected to Mongo"))
  .on("close", () => console.log("You are disconnected from Mongo"))
  .on("error", (error) => console.log(error));
///////////////////
//model
//////////////////////
const PeopleSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    title: String,
  },
  { timestamps: true }
);

const people = mongoose.model("People", PeopleSchema);
///////////////////////////////////////
//middle ware
//////////////////////////////////////
app.use(cors()); //prevent cors error, opens backend to speak with front enf
app.use(morgan("dev")); //logging
app.use(express.json()); //parse json bodies
////////////////////////////////////////
//Routes
//////////////////////////////////
//create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});
// people index routes
// get request to /people, returns all people as json
app.get("/people", async (req, res) => {
  try {
    //send all people
    res.json(await people.find({}));
  } catch (error) {
    res.status(400).json({ error });
  }
});
// people create route
//post request to /people, use request body to make new people
app.post("/people", async (req, res) => {
  try {
    // screate a new person
    res.json(await people.create(req.body));
  } catch (error) {
    res.status(400).json({ error });
  }
});
// people update route
//put request /people/:id, updates person based on id
app.put("/people/:id", async (req, res) => {
  try {
    // updates a person
    res.json(
      await people.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json({ error });
  }
});
// distroy route
//delete route to /people/:id , deletes the person specified
app.delete("/people/:id", async (req, res) => {
  try {
    // deletes a person
    res.json(await people.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json({ error });
  }
});
////////////////////////////////////////
// server listener
/////////////
app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
