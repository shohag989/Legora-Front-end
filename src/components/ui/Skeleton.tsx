import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = "animate-pulse bg-slate-200/60";
  const variantClasses = 
    variant === 'text' ? 'h-3 w-full rounded-md' :
    variant === 'circular' ? 'rounded-full' :
    'rounded-xl';

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} />
  );
};
