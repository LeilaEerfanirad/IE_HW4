const express = require('express');
const router = express.Router();
const db = require('../database'); // Import the MongoDB database connection

// Add clothes
router.post('/add-clothes', async (req, res) => {
  try {
    const { name, material, price, discount } = req.body;
    const newClothes = new db.Clothes({ name, material, price, discount });
    const result = await newClothes.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get clothes by ID
router.get('/get-clothes/:id', async (req, res) => {
  try {
    const clothes = await db.Clothes.findById(req.params.id);
    if (!clothes) {
      res.status(404).send('Clothes not found');
      return;
    }
    res.status(200).json(clothes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete all clothes
router.delete('/delete-all-clothes', async (req, res) => {
  try {
    const result = await db.Clothes.deleteMany();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit clothes by ID
router.put('/edit-clothes/:id', async (req, res) => {
  try {
    const { name, material, price, discount } = req.body;
    const updatedClothes = {
      name,
      material,
      price,
      discount,
    };
    const result = await db.Clothes.findByIdAndUpdate(req.params.id, updatedClothes, { new: true });
    if (!result) {
      res.status(404).send('Clothes not found');
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get final price by ID
router.get('/get-final-price/:id', async (req, res) => {
  try {
    const clothes = await db.Clothes.findById(req.params.id);
    if (!clothes) {
      res.status(404).send('Clothes not found');
      return;
    }
    const finalPrice = calculateFinalPrice(clothes.price, clothes.discount);
    res.status(200).json({ finalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to calculate final price with discount
function calculateFinalPrice(price, discount) {
  const discountedAmount = (price * discount) / 100;
  const finalPrice = price - discountedAmount;
  return finalPrice;
}

module.exports = router;
