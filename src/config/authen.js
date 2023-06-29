const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const comparePassword = async (password, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
}

const generateToken = (payload, secretKey, expiresIn) => {
    return jwt.sign(payload, secretKey, { expiresIn });
}

const setTimeExpired = (number, unit) => {
    if (unit == "m"){
      let times = new Date(Date.now() + number * 60 * 1000)
      let stingTime = `${number}m`
      return { times, stingTime }
  
    } else if (unit == "h") {
      let times = new Date(Date.now() + number * 60 * 60 * 1000)
      let stingTime = `${number}m`
      return { times, stingTime }
  
    } else if (unit == "d") {
      let times = new Date(Date.now() + number * 24 * 60 * 60 * 1000)
      let stingTime = `${number}m`
      return { times, stingTime }
  
    }
    return null, null
  }

const hashPassword = async (password) =>  {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }

module.exports = {
  generateToken,
  comparePassword,
  setTimeExpired,
  hashPassword
}