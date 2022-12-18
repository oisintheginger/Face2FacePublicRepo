import React from 'react';

type ProgressBarProps = {
  current: number;
};

const ProgressBar: React.FC<ProgressBarProps> = (Props) => {
  return (
    <div className="h-1 w-full bg-gray-200">
      <div className={`h-1 bg-blue-600`} style={{ width: '45%' }}></div>
    </div>
  );
};

export default ProgressBar;
