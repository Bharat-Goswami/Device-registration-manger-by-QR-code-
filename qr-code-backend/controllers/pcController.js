const Pc = require('../models/Pc');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

exports.createPc = async (req, res) => {
    const { id, name, description, assignedTo } = req.body;
    try {
      // Generate QR code data URL
      const qrCodeDataUrl = await QRCode.toDataURL(name + description);
      const lasntName = `${name}-${Date.now()}`
      const qrCodeContent = `
      Name: ${name}
      Description: ${description}
      Assigned To: ${assignedTo}
    `;
      // Generate QR code as image file
      const qrCodeFilePath = path.join(__dirname, `../public/qr-codes/${lasntName}.png`);
      await QRCode.toFile(qrCodeFilePath, qrCodeContent);
  
      // Create a new PC record
      const pc = new Pc({
        id,
        name,
        description,
        qrCode: qrCodeFilePath, // Save the file path in the database,
        qrCodeImg:`${lasntName}.png`,
        assignedTo
      });
      await pc.save();
  
      res.status(201).json({
        pc,
        downloadLink: `http://localhost:5000/qr-codes/${path.basename(qrCodeFilePath)}` // Provide the download link
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

exports.getPc = async (req, res) => {
  try {
    const pcs = await Pc.find();
    res.json(pcs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePc = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, assignedTo, qrCodeUrl } = req.body;
      console.log(qrCodeUrl);
      // Remove the old QR code file if it exists
      if (qrCodeUrl) {
        const oldQrCodeFilePath = path.join(__dirname, `../public/qr-codes/${qrCodeUrl}`);
        
        if (fs.existsSync(oldQrCodeFilePath)) {
            console.log("file deleted");
          fs.unlinkSync(oldQrCodeFilePath); // Delete the old QR code file
        }
      }
  
      // Update the PC information
      const updatedPc = await Pc.findByIdAndUpdate(id, { name, description, assignedTo }, { new: true });
  
      // Generate the new QR code
      const qrCodeContent = `
        Name: ${name}
        Description: ${description}
        Assigned To: ${assignedTo}
      `;
      
      const qrCodeFilePath = path.join(__dirname, `../public/qr-codes/${qrCodeUrl}`);
  
      await QRCode.toFile(qrCodeFilePath, qrCodeContent);
  
      // Update the PC with the new QR code file name
     // updatedPc.qrCodeUrl = newQrCodeFileName;
      await updatedPc.save();
  
      res.json(updatedPc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

exports.deletePc = async (req, res) => {
  const { id } = req.params;
  try {
    await Pc.findByIdAndDelete(id);
    res.json({ message: 'PC deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
