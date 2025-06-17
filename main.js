const express = require('express');
const db = require('./config/db');
const employeeRoutes = require('./routes/router');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', employeeRoutes);


const PORT = process.env.PORT || 3000;
db.authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
  })
  .catch(error => console.error('Connection failed:', error));