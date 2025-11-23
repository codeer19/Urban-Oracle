import React, { useState } from 'react';

function Tooltip({ children, text, position = 'top', darkMode = true }) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-8 border-x-8 border-x-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-8 border-x-8 border-x-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-8 border-y-8 border-y-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-8 border-y-8 border-y-transparent'
  };

  const bgColor = darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200';
  const textColor = darkMode ? 'text-white' : 'text-slate-900';
  const arrowColor = darkMode ? 'border-t-zinc-900' : 'border-t-white';

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      
      {show && (
        <div className={`absolute ${positionClasses[position]} z-50 animate-fade-in`}>
          <div className={`${bgColor} ${textColor} px-3 py-2 rounded-lg shadow-xl border text-sm whitespace-nowrap`}>
            {text}
          </div>
          <div className={`absolute ${arrowClasses[position]} ${arrowColor} w-0 h-0`}></div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
