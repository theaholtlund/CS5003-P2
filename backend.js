// Module code: CS5003
// Module: Masters Programming Projects
// Creating an Emojitar Generator

// Import Node.js and Express modules needed
// Cors is imported to allow requests to different domain
var express = require("express");
var cors = require("cors");
var expressBasicAuth = require("express-basic-auth");
var app = express();
const { emojitars } = require("./emojitar");

// Set up middleware functions in Express to handle incoming requests, as shown in class
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Setting up the API port
const API_PORT = 23843;

// Adding some predefined users that can log in to the system
const users = {
  admin: "supersecret",
};

// Defining variable to store created emojitars
let createdEmojitars = [];

// List all existing valid username and password pairs
// Based on material covered in class for Express autentication
const authorise = expressBasicAuth({
  users: users,
  unauthorizedResponse: (req) =>
    req.auth ? "Credentials  rejected" : "No credentials provided",
});

// ======== Frontend endpoints ========
// Linked homepage to frontend.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/frontend.html");
});

// Added endpoint to link to frontend.js from server
app.get("/frontend.js", function (req, res) {
  res.sendFile(__dirname + "/frontend.js");
});

// Added endpoint to link to frontend.css from server
app.get("/frontend.css", function (req, res) {
  res.sendFile(__dirname + "/frontend.css");
});

// Display emojitar images through static middleware
app.use(express.static("./graphics"));

// ======== API endpoints for login and signup ========
// Endpoint for users to register and add them to server
app.post("/register", (req, res) => {
  // Check if user already exists
  if (users[req.body.username] != null) {
    res.status(400).json({
      success: false,
      message: "User already exists",
    });
    return;
  }

  const username = req.body.username;
  const password = req.body.password;

  users[username] = password;

  res.status(200).json({
    success: true,
    message: "Successfully registered user",
  });
});

// Check if the provided username and password are correct
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (users[username] === password) {
    req.user = username;
    res.status(200).json({ success: true, message: "Logged in successfully" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// ======== API endpoints for components ========
// Endpoint to get the emojitar components
app.get("/emojitarcomponents", (req, res) => {
  res.send(emojitars);
});

// ======== API endpoints for emojitars ========
// Allow users to see all created emojitars by adding endpoint to server
app.get("/emojitars", (req, res) => {
  res.send(createdEmojitars);
});

// Endpoint to receive emojitars data from frontend
app.post("/emojitar", authorise, function (req, res) {
  const emojitarData = req.body;

  // Check if an emojitar with the same ID already exists
  const emojitarExists = createdEmojitars.some(
    (emojitar) => emojitar.id === emojitarData.id
  );

  if (emojitarExists) {
    res.status(400).json({
      success: false,
      message: "This ID already exists. Please enter a different ID",
    });
  } else {
    emojitarData.username = req.auth.user;
    createdEmojitars.push(emojitarData);
    res
      .status(200)
      .json({ success: true, message: `Added Emojitar ${emojitarData.id}` });
  }
});

// Allow a user to delete an emojitar they created when logged in
app.delete("/emojitar/:id", authorise, function (req, res) {
  // Find the emojitar with the given ID
  const emojitar = createdEmojitars.find(
    (emojitar) => emojitar.id === req.params.id
  );

  if (emojitar == null) {
    res.status(400).json({
      success: false,
      message: "Emojitar does not exist",
    });
    return;
  }

  // Do not allow users to create emojitars they did not make
  if (emojitar.username !== req.auth.user) {
    res.status(400).json({
      success: false,
      message: "You cannot delete another user's emojitar",
    });
    return;
  }

  // Filter saved emojitars to make sure user is the creator
  createdEmojitars = createdEmojitars.filter(
    (emojitar) => emojitar.id !== req.params.id
  );

  // Confirm that the emojitar was deleted
  res.status(200).json({
    success: true,
    message: "Deleted emojitar",
  });
});

// ======== API endpoints for comments ========
// Endpoint to receive comment data from frontend
app.post("/comment", authorise, (req, res) => {
  const commentData = req.body;

  const username = req.auth.user;

  // Do not allow users to comment on their own emojitar
  if (commentData.username === username) {
    res.status(400).json({
      success: false,
      message: "You cannot comment on your own emojitar",
    });
    return;
  }

  // Find the matching emojitar from all created emojitars
  const emojitar = createdEmojitars.find(
    (emojitar) => emojitar.id === commentData.id
  );

  if (emojitar == null) {
    res.status(400).json({
      success: false,
      message: "Emojitar does not exist",
    });
  }

  // Create new comment or push comment to existing comment display
  if (emojitar["emojitarComments"] == null) {
    emojitar["emojitarComments"] = [commentData];
  } else {
    emojitar["emojitarComments"].push(commentData);
  }

  // Confirm that comment was added
  res.status(200).json({
    success: true,
    message: "Added comment to emojitar",
  });
});

// Instruct server to listen on the port, and console log a message, to know that it is doing something
app.listen(API_PORT, () => {
  console.log(`Listening on localhost: ${API_PORT}`);
});
