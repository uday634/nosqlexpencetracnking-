require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const routUser = require('./routes/users');
const routExpence = require('./routes/expence');
const routpreiumuser = require('./routes/premiumuser')

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(cors()); // You can configure CORS options as needed.
app.use(bodyParser.json());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(helmet());
app.use(compression());

app.use('/user', routUser);
app.use('/expence', routExpence);
app.use('/premium',routpreiumuser);
// app.use('/password', routerforgot)

mongoose
  .connect('mongodb+srv://kumar:x3XuWFDdBhBzTYW2@cluster0.k9fpmib.mongodb.net/cart?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
