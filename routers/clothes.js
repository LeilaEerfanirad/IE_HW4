const express = require('express');
const router = express.Router();
// const db = require('../database'); // Import the MongoDB database connection

const Clothes = require('./database/models/clothes'); // اضافه کردن مدل لباس

router.post('/add-clothes', authenticateToken, async (req, res) => {
  const data = req.body;

  try {
   
    const newClothes = new Clothes(data);
    const savedClothes = await newClothes.save();

    res.json({ message: 'Clothes added successfully', clothes: savedClothes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/get-clothes/:id', authenticateToken, async (req, res) => {
  const clothesId = req.params.id;

  try {
   
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

router.delete('/delete-all-clothes', authenticateToken, async (req, res) => {
  try {
   
    await Clothes.deleteMany({});

    res.json({ message: 'All clothes deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/edit-clothes/:id', authenticateToken, async (req, res) => {
  const clothesId = req.params.id;
  const newData = req.body;

  try {
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

router.get('/get-final-price/:id', authenticateToken, async (req, res) => {
  const clothesId = req.params.id;

  try {
    const clothes = await Clothes.findById(clothesId);

    if (!clothes) {
      return res.status(404).json({ message: 'Clothes not found' });
    }

    const finalPrice = clothes.price - (clothes.price * clothes.discount) / 100;

    res.json({ message: 'Final price retrieved successfully', finalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
