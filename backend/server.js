// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const session = require('express-session');
const serviceAccount = require('./keys/serviceAccountKey.json');

// Firebase Admin SDK initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

const app = express();
const port = 8080;

// Middleware
/* TODO: Configure CORS here */
const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsConfig));

/* TODO: Configure express-session here */
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
