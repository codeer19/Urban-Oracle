 import React, { useState, useRef, useEffect } from 'react';
import { classifyImage, fileToBase64 } from '../services/imageClassifier';
import { uploadReport } from '../services/firebase';
import { analyzeIssueRisk, predictDeteriorationTimeline } from '../services/aiAnalysis';
import { analyzeWithGroqVision } from '../services/groqVision';

function ReportForm() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const categories = [
    { value: 'pothole', label: '🕳️ Pothole', emoji: '🕳️' },
    { value: 'streetlight', label: '💡 Streetlight', emoji: '💡' },
    { value: 'graffiti', label: '🎨 Graffiti', emoji: '🎨' },
    { value: 'garbage', label: '🗑️ Garbage', emoji: '🗑️' },
    { value: 'damaged_sign', label: '🚧 Damaged Sign', emoji: '🚧' },
    { value: 'flooding', label: '💧 Flooding', emoji: '💧' },
    { value: 'other', label: '❓ Other', emoji: '❓' },
  ];

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDescription(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAiAnalysis(null);
    setCategory('');
    setSeverity('moderate');
  };

  // Run AI analysis when category is selected OR severity changes
  useEffect(() => {
    if (image && category) {
      runAiAnalysis();
    }
  }, [category, severity]);

  const runAiAnalysis = async () => {
    if (!image || !category) return;
    
    setAnalyzing(true);
    let imageBase64;
    
    try {
      imageBase64 = await fileToBase64(image);
      
      // Use Groq AI with user-selected severity for better accuracy
      const groqAnalysis = await analyzeWithGroqVision(imageBase64, category, severity, location);
      
      if (groqAnalysis) {
        // AI analysis based on category + user severity input
        setAiAnalysis(groqAnalysis);
      } else {
        // Fallback: rule-based analysis
        const analysis = await analyzeIssueRisk(category, severity, imageBase64, location);
        const prediction = predictDeteriorationTimeline(category, severity);
        setAiAnalysis({ ...analysis, prediction, aiPowered: false });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      // Still show fallback analysis
      const analysis = await analyzeIssueRisk(category, severity, null, location);
      const prediction = predictDeteriorationTimeline(category, severity);
      setAiAnalysis({ ...analysis, prediction, aiPowered: false });
    }
    setAnalyzing(false);
  };

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !location || !category) return;

    setLoading(true);
    try {
      await uploadReport({
        image,
        location,
        classification: {
          category,
          severity,
          confidence: 1.0,
          description: description || `${category} issue reported`
        },
        description,
        timestamp: new Date()
      });
      
      setSuccess(true);
      console.log('✅ Report submitted successfully!');
      
      // Reset form
      setTimeout(() => {
        setImage(null);
        setImagePreview(null);
        setCategory('');
        setSeverity('moderate');
        setDescription('');
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('❌ Submit error:', error);
      alert('Error submitting report: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🚨 Report an Issue</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            📸 Upload Photo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {image ? '✓ Change Photo' : '📷 Take/Upload Photo'}
          </button>
          
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="mt-4 w-full rounded-lg"
            />
          )}
        </div>

        {/* Category Selection */}
        {image && (
          <div>
            <label className="block text-sm font-medium mb-2">
              🏷️ What's the issue?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-lg border-2 transition ${
                    category === cat.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <p className="text-sm mt-1">{cat.label.split(' ')[1]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Severity Selection */}
        {category && (
          <div>
            <label className="block text-sm font-medium mb-2">
              ⚠️ How severe is it? <span className="text-xs text-gray-500">(AI will adjust predictions)</span>
            </label>
            <div className="flex gap-2">
              {['minor', 'moderate', 'severe'].map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 capitalize transition ${
                    severity === sev
                      ? 'border-orange-500 bg-orange-50 font-semibold'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg">
                    {sev === 'minor' && '😊'}
                    {sev === 'moderate' && '😐'}
                    {sev === 'severe' && '😰'}
                  </div>
                  <div className="text-sm">{sev}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Select based on what you see in the image. AI will calculate risk accordingly.
            </p>
          </div>
        )}

        {/* AI Analysis Results - THIS IS YOUR DIFFERENTIATOR! */}
        {analyzing && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 animate-pulse">
            <p className="text-purple-700">🔮 UrbanOracle AI analyzing risk and impact...</p>
          </div>
        )}

        {aiAnalysis && (
          <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-purple-900">🔮 AI Analysis</h3>
              {aiAnalysis.aiPowered && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  ⚡ Powered by Groq AI
                </span>
              )}
            </div>
            
            {/* Risk Score */}
            <div className="bg-white p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Risk Score:</span>
                <span className={`text-2xl font-bold ${
                  aiAnalysis.riskScore >= 80 ? 'text-red-600' :
                  aiAnalysis.riskScore >= 60 ? 'text-orange-600' :
                  'text-yellow-600'
                }`}>
                  {aiAnalysis.riskScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    aiAnalysis.riskScore >= 80 ? 'bg-red-600' :
                    aiAnalysis.riskScore >= 60 ? 'bg-orange-600' :
                    'bg-yellow-600'
                  }`}
                  style={{ width: `${aiAnalysis.riskScore}%` }}
                />
              </div>
            </div>

            {/* Predictions - PROACTIVE! */}
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-red-600">⚠️ Predictive Alert:</p>
              <p className="text-sm mt-1">
                Will worsen to <span className="font-bold">{aiAnalysis.prediction.nextSeverity}</span> in{' '}
                <span className="font-bold">{aiAnalysis.prediction.days} days</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">{aiAnalysis.prediction.reason}</p>
            </div>

            {/* Repair Estimates */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-600">Repair Time</p>
                <p className="font-bold text-lg">{aiAnalysis.estimatedRepairTime}h</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-600">Est. Cost</p>
                <p className="font-bold text-lg">${aiAnalysis.estimatedCost}</p>
              </div>
            </div>

            {/* Impact */}
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold">Community Impact:</p>
              <p className="text-sm text-gray-700">{aiAnalysis.predictedImpact}</p>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold">🤖 AI Recommendations:</p>
              <ul className="text-sm mt-1 space-y-1">
                {aiAnalysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Description with Voice Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            📝 Description (Optional)
          </label>
          <div className="flex gap-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the issue..."
              className="flex-1 p-3 border rounded-lg"
              rows="3"
            />
            <button
              type="button"
              onClick={startVoiceInput}
              disabled={isListening}
              className={`px-4 rounded-lg ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              🎤
            </button>
          </div>
        </div>

        {/* Location Status */}
        <div className="text-sm text-gray-600">
          📍 Location: {location ? '✓ Detected' : '⏳ Detecting...'}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!image || !location || !category || loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold ${
            loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : success
              ? 'bg-green-500 text-white'
              : !category
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? '⏳ Submitting...' : success ? '✓ Submitted!' : '🚀 Submit Report'}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
