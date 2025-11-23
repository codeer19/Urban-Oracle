import React, { useState, useEffect } from 'react';

function Onboarding({ darkMode, onComplete }) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('urbanoracle_onboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShow(true), 500);
    }
  }, []);

  const steps = [
    {
      icon: '👋',
      title: 'Welcome to UrbanOracle!',
      description: 'AI-powered civic infrastructure platform that predicts problems before they happen',
      highlight: 'Get started in 30 seconds'
    },
    {
      icon: '📸',
      title: 'Report Issues Instantly',
      description: 'Snap a photo of potholes, broken lights, or any civic issue. Our AI automatically classifies and prioritizes it.',
      highlight: 'AI does the work for you'
    },
    {
      icon: '🗳️',
      title: 'Vote with Blockchain',
      description: 'Vote on issues that matter to you. Every vote is recorded on blockchain - transparent and tamper-proof.',
      highlight: 'Your voice counts'
    },
    {
      icon: '🎮',
      title: 'Earn Rewards',
      description: 'Get points for reporting, voting, and helping your community. Climb the leaderboard and unlock badges!',
      highlight: 'Make it fun'
    },
    {
      icon: '🚀',
      title: 'Ready to Start?',
      description: 'Join thousands making their cities better. Report your first issue and earn 50 points!',
      highlight: 'Let\'s go!'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };



  const handleComplete = () => {
    localStorage.setItem('urbanoracle_onboarding', 'true');
    setShow(false);
    if (onComplete) onComplete();
  };

  if (!show) return null;

  const currentStep = steps[step];
  const bgClass = darkMode ? 'bg-zinc-900/95' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <div className={`${bgClass} rounded-3xl max-w-lg w-full p-8 shadow-2xl border ${darkMode ? 'border-zinc-800' : 'border-slate-200'} animate-slide-up`}>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i <= step
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    : darkMode ? 'bg-zinc-800' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce">{currentStep.icon}</div>
          <h2 className={`text-3xl font-black mb-3 ${textClass}`}>
            {currentStep.title}
          </h2>
          <p className="text-lg text-slate-400 mb-4">
            {currentStep.description}
          </p>
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full">
            <span className="text-emerald-400 font-semibold text-sm">
              ✨ {currentStep.highlight}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all"
          >
            {step === steps.length - 1 ? 'Get Started 🚀' : 'Next →'}
          </button>
        </div>

        {/* Step Counter */}
        <p className="text-center text-sm text-slate-500 mt-4">
          {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}

export default Onboarding;
