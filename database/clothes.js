const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return new mongoose.Types.ObjectId()
    },
    unique: true
  },
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
