const jwt = require('jsonwebtoken');
const router = express.Router()

module.exports.generateAccessToken = (userData) => {
    return jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
};

module.exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;

        next();
    });
};
