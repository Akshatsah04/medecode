const Report = require('../models/Report');
const { generateDashboardInsights } = require('../utils/ai');

const getDashboardData = async (req, res) => {
  try {
    // 1. Fetch all reports for the user, oldest first
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: 1 });
    
    // 2. Base metrics
    const totalReports = reports.length;
    let recentReports = [...reports].reverse().slice(0, 5); // Last 5
    let healthScore = 100;
    let riskLevel = "Low";
    
    const trends = [];
    const abnormalCountMap = {};
    
    let latestReportAbnormalCount = 0;

    // 3. Process historical data
    reports.forEach((report, index) => {
      // Isolate actual abnormalities vs "normal" baseline parameters returned by AI
      const actualAbnormalities = report.abnormalValues.filter(val => {
        const status = val.status?.toLowerCase() || '';
        return !status.includes('normal') && !status.includes('in range');
      });

      // Trending array for frontend charting
      trends.push({
        date: new Date(report.createdAt).toLocaleDateString(),
        abnormalCount: actualAbnormalities.length,
        score: Math.max(0, 100 - (actualAbnormalities.length * 5))
      });

      // Summary map frequencies
      actualAbnormalities.forEach(item => {
        const keyName = item.name.toLowerCase().trim();
        if (abnormalCountMap[keyName]) {
          abnormalCountMap[keyName].count += 1;
        } else {
          abnormalCountMap[keyName] = { name: item.name, count: 1 };
        }
      });
      
      // Keep track of the final report to drive current Top Level score
      if (index === reports.length - 1) {
        latestReportAbnormalCount = actualAbnormalities.length;
      }
    });

    // 4. Transform maps to sorted arrays
    const abnormalSummary = Object.values(abnormalCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 recurring issues

    // 5. Calculate global Health Score
    // (Based exclusively on the most recent report, or a 100 benchmark if empty)
    if (totalReports > 0) {
      healthScore = Math.max(0, 100 - (latestReportAbnormalCount * 5));
    }

    if (healthScore >= 80) {
      riskLevel = "Low";
    } else if (healthScore >= 50) {
      riskLevel = "Moderate";
    } else {
      riskLevel = "High";
    }

    // 6. Generate Contextual AI Insight
    // Language query defaults to 'English' if not provided
    const language = req.query.language || 'English';
    let insightString = "";
    if (totalReports > 0 && abnormalSummary.length > 0) {
      insightString = await generateDashboardInsights(abnormalSummary, language);
    } else {
      insightString = "No historic abnormality patterns found! Great job.";
    }

    // 7. Push payload
    res.json({
      healthScore,
      riskLevel,
      trends,
      abnormalSummary,
      insights: insightString,
      totalReports,
      recentReports
    });

  } catch (error) {
    console.error("Dashboard fetching error: ", error);
    res.status(500).json({ error: 'Failed to access robust dashboard analytics.' });
  }
};

module.exports = { getDashboardData };
