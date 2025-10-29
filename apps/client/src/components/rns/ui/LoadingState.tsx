import React from 'react';

interface LoadingStateProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  text = 'Loading...', 
  size = 'md',
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {variant === 'spinner' && (
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className={`absolute inset-0 rounded-full border-4 border-transparent 
            border-t-blue-500 animate-spin`} />
          <div className={`absolute inset-0 rounded-full border-4 border-transparent 
            border-t-purple-500 animate-spin`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        </div>
      )}

      {variant === 'dots' && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} 
                bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {variant === 'pulse' && (
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
            animate-ping opacity-20" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
            animate-ping opacity-20" style={{ animationDelay: '0.5s' }} />
          <div className="relative rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
            w-full h-full animate-pulse" />
        </div>
      )}

      {variant === 'wave' && (
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`${size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : 'w-2'} 
                ${size === 'sm' ? 'h-8' : size === 'md' ? 'h-12' : 'h-16'}
                bg-gradient-to-t from-blue-500 to-purple-500 rounded-full`}
              style={{
                animation: 'wave 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      <p className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
        {text}
      </p>

      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;