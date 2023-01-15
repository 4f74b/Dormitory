const express = require("express");
const fileUpload = require("express-fileupload");
const uploadProfile = require("./controllers/register-face/upload-profile");
const checkExistance = require("./checkExistance");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser({ limit: "50mb" }));

app.use(fileUpload());
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
// Setting the folder for static assets
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/models")));

app.listen(port, () => {
  console.log("Server started on port" + port);
});

mongoose.connect("mongodb://0.0.0.0:27017/Dormatory", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//the following will check for a successfull connection to mongodb, The above commented code can also be used
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("database connected");
});

// render face registration form
app.get("/post-face", (req, res) => {
  res.render("register/face-form");
});
// recieve data of posted face
app.post("/post-face", async (req, res) => {
  uploadProfile(req.body);
  res.redirect("/surveillance");
});

// Surveillance page
app.get("/surveillance", (req, res) => {
  console.log(path.join(__dirname + "/public"));
  res.render("surveillance/surveillance");
});

// recieve data of a face and detect wheter the person is present in database
app.post("/check-face", async (req, res) => {
  res.send(await checkExistance(req.body));
});

// recieve intruder face data and save it
app.post("/post-intruder", (req, res) => {
  console.log(req.body);
});

app.get("/dormitory/student", (req, res) => {
  res.render("student/index");
});
