const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const pcRoutes = require('./routes/pcRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Serve static files (like QR code images) from the "public" directory
app.use('/qr-codes', express.static(path.join(__dirname, 'public/qr-codes')));

mongoose.connect('mongodb+srv://bgforanyuse:Bharat2112@cluster0.owb6ekt.mongodb.net/qr_code_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/pc', pcRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
