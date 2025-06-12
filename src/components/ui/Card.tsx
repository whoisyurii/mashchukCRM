import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-dark-900 border border-dark-700 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};