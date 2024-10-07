const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const chatbotRoutes = require('./routes/chatBotRoutes');
const MongoStore = require('connect-mongo');
const cors = require('cors');  // cors kütüphanesini ekliyoruz
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',  // Oturumların hangi koleksiyonda saklanacağı
    }),
    cookie: {
      maxAge: 1000 * 60 * 30  // Oturum süresi (30 dakika)
    }
  }));

  // Localhost için dinamik origin kontrolü
  const corsOptions = {
    origin: function (origin, callback) {
      // Eğer origin yoksa (örneğin Postman'den istek yapılırsa)
      if (!origin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // Oturum çerezlerini kullanabilmek için gerekli
  };

  app.use(cors(corsOptions));  // cors middleware'ini kullanıyoruz

app.use(sessionMiddleware);
app.use('/chatbot', chatbotRoutes);

module.exports = app;
