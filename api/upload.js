const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });

  let savedFile = '';
  let mimeType = '';

  bb.on('file', (name, file, info) => {
    const { filename, mimeType: mime } = info;
    mimeType = mime;
    const ext = path.extname(filename) || '.bin';
    const media = Date.now() + Math.random().toString(36).substr(2, 9);
    const uploadDir = path.join(process.cwd(), 'Img');
    
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    const saveTo = path.join(uploadDir, `${media}${ext}`);
    file.pipe(fs.createWriteStream(saveTo));
    savedFile = `/Img/${media}${ext}`;
  });

  bb.on('finish', () => {
    res.json({ success: true, url: savedFile });
  });

  bb.on('error', (err) => {
    res.status(500).json({ success: false, error: err.message });
  });

  req.pipe(bb);
};