import React from 'react';
import { CardProps } from '@/types/rns/ui';

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="">{children}</div>
    </div>
  );
};

export default Card;
