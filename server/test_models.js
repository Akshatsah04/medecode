require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const modelsToTest = [
    'gemini-1.5-flash-8b', 
    'gemini-1.5-flash-002', 
    'gemini-1.5-flash-latest', 
    'gemini-1.5-pro',
    'gemini-1.0-pro'
  ];
  
  for (const mod of modelsToTest) {
    try {
      console.log("Testing:", mod);
      const res = await aiClient.models.generateContent({
        model: mod,
        contents: "Say 'yes' if you can hear me."
      });
      console.log("SUCCESS:", mod);
    } catch (e) {
      console.error("FAIL:", mod, e.message);
    }
  }
}
run();
