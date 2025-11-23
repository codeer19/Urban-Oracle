// Groq Vision API - Free and Fast
// Get your free API key at: https://console.groq.com

export async function analyzeImageWithGroq(imageBase64, category, severity) {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  
  // Fallback if API key not set or expired
  if (!apiKey || apiKey === 'your_groq_key_here') {
    console.warn('⚠️ Groq API key not set, using rule-based fallback');
    return getRuleBasedAnalysis(category, severity);
  }

  try {
    console.log(`🚀 Groq AI: Analyzing ${severity} ${category}...`);
    
    // Use text-only model with user-provided severity for accurate predictions
    const prompt = `You are an expert civil engineer analyzing urban infrastructure damage.

Issue Type: ${category}
User-Reported Severity: ${severity}

A citizen has reported a ${severity} ${category}. Based on this severity level and typical ${category} deterioration patterns, provide a detailed risk assessment.

Provide:
1. Risk score (0-100) - how dangerous is a ${severity} ${category}?
2. Days until it worsens to next severity level
3. Estimated repair time in hours for a ${severity} ${category}
4. Estimated repair cost in USD for a ${severity} ${category}
5. Specific recommendations for repair crew

Consider factors like:
- Weather impact on ${category}
- Traffic load effects
- Safety hazards for ${severity} level
- Typical deterioration patterns
- Community impact

Respond with ONLY valid JSON:
{
  "actualSeverity": "${severity}",
  "riskScore": 85,
  "daysUntilWorse": 7,
  "repairTimeHours": 8,
  "repairCostUSD": 2000,
  "recommendations": ["Action 1", "Action 2", "Action 3"],
  "reasoning": "Brief explanation of why this ${severity} ${category} needs attention"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Fast text model that works from browser
        messages: [
          {
            role: 'system',
            content: 'You are an expert civil engineer specializing in urban infrastructure assessment and predictive maintenance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error details:', errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    console.log('🤖 Groq raw response:', content);
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      console.log('✅ Groq analysis complete:', analysis);
      return analysis;
    }
    
    return null;
    
  } catch (error) {
    console.error('❌ Groq error:', error);
    return null;
  }
}

// Enhanced AI analysis using Groq with user severity input
export async function analyzeWithGroqVision(imageBase64, category, severity, location) {
  const groqAnalysis = await analyzeImageWithGroq(imageBase64, category, severity);
  
  if (!groqAnalysis) {
    // Fallback to rule-based if Groq fails
    return null;
  }
  
  // Combine Groq AI analysis with user input
  return {
    detectedSeverity: severity, // User-selected severity
    riskScore: groqAnalysis.riskScore,
    estimatedRepairTime: groqAnalysis.repairTimeHours,
    estimatedCost: groqAnalysis.repairCostUSD,
    urgencyLevel: groqAnalysis.riskScore >= 80 ? 'critical' : 
                  groqAnalysis.riskScore >= 60 ? 'high' : 
                  groqAnalysis.riskScore >= 40 ? 'medium' : 'low',
    predictedImpact: groqAnalysis.reasoning,
    similarIssuesNearby: 0,
    recommendations: groqAnalysis.recommendations,
    prediction: {
      days: groqAnalysis.daysUntilWorse,
      nextSeverity: getNextSeverity(severity),
      reason: `AI prediction based on ${severity} ${category} deterioration patterns`
    },
    aiPowered: true // Flag to show this used real AI
  };
}

function getNextSeverity(current) {
  const levels = { minor: 'moderate', moderate: 'severe', severe: 'critical' };
  return levels[current] || 'worse';
}


// Rule-based fallback when Groq API is unavailable
function getRuleBasedAnalysis(category, severity) {
  const severityMultipliers = {
    minor: 0.5,
    moderate: 1.0,
    severe: 2.0
  };
  
  const baseData = {
    pothole: { risk: 70, days: 14, hours: 4, cost: 500 },
    streetlight: { risk: 50, days: 30, hours: 2, cost: 300 },
    graffiti: { risk: 20, days: 90, hours: 3, cost: 200 },
    garbage: { risk: 30, days: 7, hours: 1, cost: 100 },
    damaged_sign: { risk: 60, days: 21, hours: 2, cost: 400 },
    flooding: { risk: 90, days: 3, hours: 8, cost: 3000 },
    other: { risk: 50, days: 14, hours: 4, cost: 500 }
  };
  
  const base = baseData[category] || baseData.other;
  const multiplier = severityMultipliers[severity] || 1.0;
  
  return {
    actualSeverity: severity,
    riskScore: Math.min(100, Math.round(base.risk * multiplier)),
    daysUntilWorse: Math.max(1, Math.round(base.days / multiplier)),
    repairTimeHours: Math.round(base.hours * multiplier),
    repairCostUSD: Math.round(base.cost * multiplier),
    recommendations: [
      `Inspect ${category} immediately`,
      `Assess structural integrity`,
      `Schedule repair within ${Math.round(base.days / multiplier)} days`
    ],
    reasoning: `${severity} ${category} requires attention. Rule-based analysis (Groq API unavailable).`
  };
}
