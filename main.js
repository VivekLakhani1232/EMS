const express = require('express');
const db = require('./config/db');
const app = express();
require('dotenv').config();


const PORT = process.env.PORT || 3000;
db.authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
  })
  .catch(error => console.error('Connection failed:', error));