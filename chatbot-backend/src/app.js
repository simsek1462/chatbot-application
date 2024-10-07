const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const chatbotRoutes = require('./routes/chatBotRoutes');
const MongoStore = require('connect-mongo');
const cors = require('cors'); 
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',  
    }),
    cookie: {
      maxAge: 1000 * 60 * 30  
    }
  }));

  // dynamic origin for localhost
  const corsOptions = {
    origin: function (origin, callback) {
     
      if (!origin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true 
  };

  app.use(cors(corsOptions));  

app.use(sessionMiddleware);
app.use('/chatbot', chatbotRoutes);

module.exports = app;
