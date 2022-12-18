import { CheckIcon } from '@heroicons/react/24/solid';
import React from 'react';

type StepperProps = {
  steps: readonly { id: number; name: string }[];
  current: number;
};

const Stepper: React.FC<StepperProps> = ({ steps, current }) => {
  return (
    <div className="relative flex flex-col items-center">
      <hr className="absolute top-[1.125rem] mx-auto  w-[93%] border-t-4" />
      <div className="relative flex min-w-full justify-between">
        {steps.map(({ id, name }) => {
          const active = id === current;

          const isCompleted = current > id;

          return (
            <div key={id} className="basis-11 text-center">
              <div
                className={`${
                  active
                    ? 'border-white bg-primary text-white'
                    : isCompleted
                    ? 'border-white bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-300'
                }
                    shadow-step-shadow mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-semibold`}
              >
                {isCompleted ? <CheckIcon className="w-5" /> : id}
              </div>
              <p
                className={`mt-3 text-xs font-medium ${
                  active
                    ? 'text-primary'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-300'
                }`}
              >
                {name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
