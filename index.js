const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

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

const Clothes = require('./models/clothes'); // اضافه کردن مدل لباس

// Example routes for managing clothes (CRUD operations)
app.post('/add-clothes', authenticateToken, async (req, res) => {
  const data = req.body;

  try {
    // Create a new clothes document in the database
    const newClothes = new Clothes(data);
    const savedClothes = await newClothes.save();

    res.json({ message: 'Clothes added successfully', clothes: savedClothes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/get-clothes/:id', authenticateToken, async (req, res) => {
  const clothesId = req.params.id;

  try {
    // Find clothes by ID in the database
    const clothes = await Clothes.findById(clothesId);

    if (!clothes) {
      return res.status(404).json({ message: 'Clothes not found' });
    }

    res.json({ message: 'Clothes retrieved successfully', clothes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/delete-all-clothes', authenticateToken, async (req, res) => {
  try {
    // Delete all clothes from the database
    await Clothes.deleteMany({});

    res.json({ message: 'All clothes deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/edit-clothes/:id', authenticateToken, async (req, res) => {
  const clothesId = req.params.id;
  const newData = req.body;

  try {
    // Find and update clothes by ID in the database
    const updatedClothes = await Clothes.findByIdAndUpdate(clothesId, newData, { new: true });

    if (!updatedClothes) {
      return res.status(404).json({ message: 'Clothes not found' });
    }

    res.json({ message: 'Clothes edited successfully', clothes: updatedClothes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/get-final-price/:id', authenticateToken, async (req, res) => {
  const clothesId = req.params.id;

  try {
    // Find clothes by ID in the database
    const clothes = await Clothes.findById(clothesId);

    if (!clothes) {
      return res.status(404).json({ message: 'Clothes not found' });
    }

    // Calculate final price based on discount, if any
    const finalPrice = clothes.price - (clothes.price * clothes.discount) / 100;

    res.json({ message: 'Final price retrieved successfully', finalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});