const tesseract = require('tesseract.js');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const extractText = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else {
      // It's an image
      const { data: { text } } = await tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(m)
      });
      return text;
    }
  } catch (error) {
    console.error("OCR Extraction Error:", error);
    throw new Error('OCR text extraction failed.');
  }
};

module.exports = { extractText };
