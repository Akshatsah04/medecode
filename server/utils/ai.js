const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cleanJsonString = (str) => {
  if (!str) return "";
  return str.replace(/```json/gi, '').replace(/```/g, '').trim();
};

const isValidResponse = (jsonStr) => {
  try {
    const cleaned = cleanJsonString(jsonStr);
    const data = JSON.parse(cleaned);
    if (data.insight) return true;
    if (data.summary && data.simplifiedExplanation && Array.isArray(data.abnormalValues)) return true;
    return false;
  } catch (e) {
    return false;
  }
};

const executeWithFallback = async (prompt, filePart = null) => {
  // Pass strings directly if no file is present; otherwise, pass the array
  const contents = filePart ? [prompt, filePart] : prompt;
  const config = { responseMimeType: "application/json" };

  try {
    console.log("Using primary model");
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config
    });
    
    const cleanedText = cleanJsonString(response.text);
    if (isValidResponse(cleanedText)) {
      return cleanedText;
    } else {
      throw new Error(`Invalid Output Format from primary: ${response.text}`);
    }
  } catch (error) {
    const errStr = error.message || String(error);
    console.log(`Primary failed, switching to fallback. Error: ${errStr}`);
    
    await delay(1500); 
    
      try {
        console.log("Using fallback model");
        const fallbackResponse = await aiClient.models.generateContent({
          model: 'gemini-1.0-pro',
          contents,
          config
        });
      
      const cleanedFallback = cleanJsonString(fallbackResponse.text);
      if (isValidResponse(cleanedFallback)) {
        return cleanedFallback;
      } else {
        throw new Error(`Invalid Output Format from fallback: ${fallbackResponse.text}`);
      }
    } catch (fallbackError) {
      console.log(`Fallback failed, using dummy response. Error: ${fallbackError.message || String(fallbackError)}`);
      throw new Error("Fallback failed.");
    }
  }
};

const getDummyResponse = () => {
  return {
    summary: "Demo response",
    simplifiedExplanation: "...",
    abnormalValues: [],
    suggestions: "Please consult a doctor."
  };
};

const getDummyInsight = () => {
  return "You have had consistent trends in your health markers recently. Your most common abnormality appears to be related to general metrics. Ensure you maintain a balanced lifestyle and regularly consult your physician.";
};

const generateDashboardInsights = async (abnormalSummary, language = 'English') => {
  if (!abnormalSummary || abnormalSummary.length === 0) {
    return "No recurring abnormal patterns detected in your recent reports. Great job!";
  }

  try {
    const summaryText = abnormalSummary.map(item => `${item.name}: occurred ${item.count} times`).join(", ");
    const prompt = `
You are a top-tier medical assistant AI. Summarize the following recurring abnormal health metrics found over a patient's historical medical reports into a concise, 2-sentence encouraging insight or warning. 
Translate the final response into ${language.toUpperCase()}.

Patient's most frequent abnormal metrics over their history:
${summaryText}

Return only the final 2-sentence text inside a JSON format under the key "insight". Example: { "insight": "Your response here" }
`;

    const responseText = await executeWithFallback(prompt);
    const result = JSON.parse(responseText);
    return result.insight || getDummyInsight();
  } catch (error) {
    console.error("Dashboard AI Insight Error:", error.message);
    return getDummyInsight();
  }
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

    const responseText = await executeWithFallback(prompt, filePart);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    console.log("Falling back to dummy response.");
    return getDummyResponse();
  }
};

module.exports = { analyzeReport, getDummyResponse, generateDashboardInsights };
