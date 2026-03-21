# Medecode – AI Medical Report Simplifier

Medecode is a full-stack web application that allows users to upload medical reports (PDF or images), extracts the text using Optical Character Recognition (OCR), and uses AI (Google Gemini) to convert complex medical terminology into simple, patient-friendly explanations. 

## Features
- **Strict Format JSON Reponses:** Fully structured AI outputs ensuring correct parsing.
- **Robust Error Handling & Dummy Failovers:** App continues to work with intelligent fallback data if the AI API limits are hit or OCR fails.
- **File Security Validations:** Only accepts specific Images and PDF documents.
- **Explain Mode Toggles:** Choose between `Simple` and `Detailed` explanation structures.
- **Advanced Highlighters:** Abnormal, normal, and borderline values are explicitly mapped and color-coded.
- **Modern UI:** Built with Framer Motion, Tailwind CSS dark theme, and Lucide Icons for a premium look.

---

## 🏗️ Tech Stack
- **Frontend:** React (Vite.js), Tailwind CSS, Axios, Framer Motion
- **Backend:** Node.js, Express, Multer
- **Database:** MongoDB (Mongoose)
- **AI/OCR:** Google Gemini API, Tesseract.js, pdf-parse

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Google Gemini API Key

### 1. Clone & Install Dependencies
First, open your terminal at the project root (`medisimp`):

**Install Backend Dependencies:**
```bash
cd server
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../client
npm install
```

### 2. Configure Environment Variables
In the `server/` directory, create a `.env` file (one might already be partially configured) and ensure it has:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mediexplain
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(Replace `your_actual_gemini_api_key_here` with your Google Gemini Key)*

### 3. Run the Application

**Start the Backend Server:**
Open a terminal and run:
```bash
cd server
npm run dev
```

**Start the Frontend Client:**
Open a new terminal and run:
```bash
cd client
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to view the application!

---

## 🎯 Important Notes
- Ensure your MongoDB connection works, otherwise the database connection might error out (though the UI processing will still work with dummy responses on server failure thanks to our robust fallback logic).
- To test the OCR and AI, upload a screenshot or PDF of a sample blood test that includes terms like "Haemoglobin", "Blood Pressure", etc.
