const jwt = require("jsonwebtoken");

const createNewToken = (payload) => {
    return jwt.sign({ userId: payload }, process.getuid.SECRET_KEY, { expiresIn: '10d' });
}

module.exports = {
    createNewToken
};  // export the function to be used in other files