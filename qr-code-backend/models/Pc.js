const mongoose = require('mongoose');

const PcSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },  // Unique ID
  name: { type: String, required: true },
  description: { type: String, required: true },
  qrCode: { type: String, required: true },
  qrCodeImg: { type: String, required: true },
  assignedTo: { type: String },  // New field for assignment

});

module.exports = mongoose.model('Pc', PcSchema);
