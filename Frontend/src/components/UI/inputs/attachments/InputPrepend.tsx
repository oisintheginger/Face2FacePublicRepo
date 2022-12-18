import React from 'react';

const InputPrepend: React.FC<{
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
}> = ({ Icon }) => (
  <div className="form-control-prepend">
    <Icon className="h-4 w-4 text-gray-700" />
  </div>
);

export default InputPrepend;
