const express = require('express');
const app = express();
const router = express().router();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./database')
// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

// Routes
const clothesRouter = require('./routes/clothes');
app.use('/clothes', clothesRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/signup', async (req, res) => {
    const data = req.body;
    const user = await db.User.findOne({ email: data.email });

    if (user) {
        return res.status(400).send('This email already registered!');
    }

    const new_user = new db.User(data);

    res.status(200).send(await new_user.save());
});

app.post('/login', async (req, res) => {
    const data = req.body;
    const user = await db.User.findOne({ email: data.email });

    if (!user) {
        return res.status(400).send('Username does not exist.');
    }

    if (user.password !== data.password) {
        return res.status(400).send('Your password was not match.');
    }

    const token = jwtUtils.generateAccessToken({ email: data.email });

    res.status(200).send(token);
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});