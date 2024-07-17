const bcrypt = require('bcrypt');

const securePass = async (password) => {
    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};

const decryptPass = async (password) => {
    try {
        
        const decryptedPassword = await bcrypt.compare(password, userData.password);
        return decryptedPassword;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    securePass,
    decryptPass
}
