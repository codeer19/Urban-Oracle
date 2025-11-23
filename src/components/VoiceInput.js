import React, { useState, useEffect } from 'react';

function VoiceInput({ onTranscript, darkMode }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          onTranscript(transcriptText);
          setIsListening(false);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setSupported(true);
    } else {
      setSupported(false);
    }
  }, [onTranscript]);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!supported) {
    return null; // Hide if not supported
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`relative px-4 py-3 rounded-xl font-semibold transition-all ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : darkMode
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500'
        } shadow-lg hover:shadow-xl transform hover:scale-105`}
      >
        {isListening ? (
          <>
            <span className="inline-block animate-pulse">🎤</span> Listening...
          </>
        ) : (
          <>
            🎤 Voice Input
          </>
        )}
      </button>

      {isListening && (
        <div className={`absolute top-full mt-2 left-0 right-0 ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'} border rounded-lg p-3 shadow-xl animate-fade-in`}>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
            Speak now...
          </p>
          {transcript && (
            <p className={`text-sm ${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>
              "{transcript}"
            </p>
          )}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {!isListening && transcript && (
        <div className={`absolute top-full mt-2 left-0 right-0 ${darkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'} border rounded-lg p-3 shadow-xl animate-fade-in`}>
          <p className="text-xs text-green-400 mb-1">✓ Captured:</p>
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>
            "{transcript}"
          </p>
        </div>
      )}
    </div>
  );
}

export default VoiceInput;
