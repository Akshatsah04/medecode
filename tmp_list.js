require('dotenv').config({ path: 'server/.env' });
const { GoogleGenAI } = require('@google/genai');
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const response = await aiClient.models.list();
    for await (const m of response) {
      console.log(m.name);
    }
  } catch (e) {
    console.error(e);
  }
}
run();
