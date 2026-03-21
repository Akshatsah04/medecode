const { analyzeReport, getDummyResponse } = require('../utils/ai');
const Report = require('../models/Report');
const fs = require('fs');

const getHistory = async (req, res) => {
  try {
    const history = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

const processReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { mode, language } = req.body; // 'Simple' or 'Detailed', 'English' or 'Hindi'

    // 1. AI Analysis with Native Multimodal Input (bypassing local OCR)
    let analysisResult;
    try {
      analysisResult = await analyzeReport(req.file.path, req.file.mimetype, mode, language || 'English');
    } catch (aiError) {
      console.error(aiError);
      analysisResult = getDummyResponse();
    }

    // Clean up uploaded file AFTER Gemini reads it
    fs.unlinkSync(req.file.path);

    // Validate if it's correct json format roughly
    if (!analysisResult || !analysisResult.summary) {
      console.error("Invalid AI JSON structure, returning dummy.");
      analysisResult = getDummyResponse();
    }

    // 2. Save to database
    let newReport;
    try {
      newReport = new Report({
        originalText: "Processed natively via Gemini Multimodal API",
        summary: analysisResult.summary,
        simplifiedExplanation: analysisResult.simplifiedExplanation,
        abnormalValues: analysisResult.abnormalValues || [],
        suggestions: analysisResult.suggestions
      });
      await newReport.save();
    } catch (dbError) {
      console.error("Database save failed: ", dbError);
    }

    // 3. Return response
    return res.status(200).json(analysisResult);

  } catch (error) {
    console.error("Server Error in processReport:", error);
    return res.status(500).json({ error: "Processing failed." });
  }
};

module.exports = { processReport, getHistory };
