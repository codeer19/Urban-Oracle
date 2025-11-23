import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);

// Image Classification Agent
export async function classifyImage(imageFile) {
  try {
    console.log('🤖 Gemini: Analyzing image...');
    
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Get Gemini model (free tier model)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Create prompt
    const prompt = `You are an expert at identifying urban infrastructure problems. Analyze this image carefully.

Classify it into ONE of these categories:
- pothole: Holes, cracks, or damage in roads/pavement
- streetlight: Broken/dark streetlights, missing bulbs, damaged light poles
- graffiti: Spray paint, vandalism, unwanted markings on walls/buildings
- garbage: Trash piles, litter, overflowing bins, waste on streets
- damaged_sign: Broken traffic signs, fallen street signs, damaged road signs
- flooding: Water pooling on roads, drainage problems, flooded areas
- other: Anything that doesn't fit above categories

Rate severity as:
- minor: Small issue, not urgent
- moderate: Noticeable problem, should be fixed soon
- severe: Dangerous or major problem, needs immediate attention

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "category": "pothole",
  "severity": "severe",
  "confidence": 0.95,
  "description": "Large pothole on main road"
}`;

    // Send to Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image.split(',')[1]
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    console.log('🤖 Gemini raw response:', text);
    
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const classification = JSON.parse(jsonMatch[0]);
      console.log('✅ Gemini classified as:', classification);
      return classification;
    }
    
    console.warn('⚠️ Could not parse Gemini response:', text);
    
    // Fallback if parsing fails
    return {
      category: 'other',
      severity: 'moderate',
      confidence: 0.7,
      description: 'Classification uncertain - please add description'
    };
    
  } catch (error) {
    console.error('❌ Gemini error:', error);
    
    // Fallback classification
    return {
      category: 'other',
      severity: 'moderate',
      confidence: 0.5,
      description: 'AI classification failed: ' + error.message
    };
  }
}

// Helper: Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}