const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  material: {
    type: String,
    enum: ['Leather', 'Cotton', 'Denim', 'Linen'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

const Clothes = mongoose.model('Clothes', clothesSchema);

module.exports = Clothes;
