const express = require('express');
const {signup} = require('./controllers/authController.js');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/signup',signup)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});