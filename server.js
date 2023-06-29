const express = require('express');
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productRoute = require('./src/routes/productRoute')
const userRoute = require('./src/routes/userRoute')
const reviewRoute = require('./src/routes/reviewRoute')
const authenRoute = require('./src/routes/authenRoute')

app.use('/api', productRoute)
app.use('/api', userRoute)
app.use('/api', reviewRoute)
app.use('/', authenRoute)
 
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});