import React from 'react';

type FeaturePillProps = {
  Icon?: React.ComponentType<React.ComponentProps<'svg'>>;
  text: React.ReactNode;
};

const FeaturePill: React.FC<FeaturePillProps> = ({ Icon, text }) => {
  return (
    <div
      className={`flex items-center rounded-full bg-thistle bg-opacity-[0.25] p-[0.375rem] pr-[0.75rem] ${
        !!Icon ? 'pr-[0.75rem]' : 'px-[0.875rem]'
      }`}
    >
      {Icon ? (
        <div className="mr-2 inline-flex items-center justify-center rounded-full bg-primary-50 p-1">
          <Icon className="inline-block h-4 w-4 text-gray-800" />
        </div>
      ) : null}
      <span className="inline-block">{text}</span>
    </div>
  );
};

export default FeaturePill;
