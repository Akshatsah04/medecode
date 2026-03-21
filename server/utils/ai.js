const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getDummyResponse = () => {
  return {
    summary: "This is a dummy summary. The AI service is currently unavailable.",
    simplifiedExplanation: "The report indicates some values. This is a fallback explanation because the AI failed to process your exact report.",
    abnormalValues: [
      {
        name: "Blood Pressure",
        value: "150/90",
        normalRange: "120/80",
        status: "High"
      },
      {
        name: "Heart Rate",
        value: "75",
        normalRange: "60-100",
        status: "Normal"
      }
    ],
    suggestions: "Please consult a doctor for a proper reading as this is dummy data."
  };
};

const analyzeReport = async (filePath, mimetype, mode = 'Simple', language = 'English') => {
  try {
    const detailInstruction = mode === 'Detailed' 
      ? "Provide a highly detailed explanation suitable for a patient who wants to deeply understand their medical report."
      : "Convert the medical report into simple language for a non-medical person.";

    const prompt = `
${detailInstruction}

CRITICAL REQUIREMENTS FOR TRANSLATION: 
1. You MUST translate all the text strings, summaries, insights, and explanations into ${language.toUpperCase()}.
2. DO NOT translate the JSON keys. The JSON keys MUST remain in English exactly as shown in the schema below.

CRITICAL REQUIREMENT FOR EXTRACTION:
Extract ALL key metrics and test results from the document into the "abnormalValues" array, even if their status is "Normal". We want to show the user all extracted values.

Convert the provided medical report document into simple language. Return STRICTLY in JSON format:

{
  "summary": "...",
  "simplifiedExplanation": "...",
  "abnormalValues": [
    {
      "name": "...",
      "value": "...",
      "normalRange": "...",
      "status": "High/Low/Normal/Borderline"
    }
  ],
  "suggestions": "..."
}

Do not return anything outside JSON.
`;

    const filePart = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
        mimeType: mimetype
      }
    };

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt, filePart],
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    // The model with JSON config returns exact JSON, but just to be safe:
    return JSON.parse(resultText);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    console.log("Falling back to dummy response.");
    return getDummyResponse();
  }
};

module.exports = { analyzeReport, getDummyResponse };
