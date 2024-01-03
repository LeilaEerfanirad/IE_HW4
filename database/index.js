const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log(err.message);
});

const db = {};
db.mongoose = mongoose;

const userModel = {
    email: String,
    username: String,
    password: String,
};
const userSchema = db.mongoose.Schema(userModel, { discriminatorKey: 'userType' });
const User = db.mongoose.model('User', userSchema);
db.User = User;

module.exports = db;
