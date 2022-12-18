import React from 'react';
import { InputProps } from 'src/components/UI/inputs/interfaces';

const Checkbox: React.FC<InputProps> = (props) => {
  const {
    id,
    errors,
    inputRef,
    label,
    groupClasses,
    labelProps,
    className,
    ...inputProps
  } = props;

  return (
    <>
      <div className={`${groupClasses || ''} mb-6`}>
        <div className="flex items-center">
          <input
            id={id}
            type="checkbox"
            {...inputRef}
            className={`h-[1.125rem] w-[1.125rem] rounded border-gray-300 text-primary focus:ring-primary focus:ring-opacity-30 ${className}`}
            {...inputProps}
          />
          <label
            htmlFor={id}
            {...(labelProps && { ...labelProps })}
            className="ml-3 block text-sm font-medium"
          >
            {label}
          </label>
        </div>
        {inputRef?.name && errors?.[inputRef?.name] && (
          <small className="form-error ml-3 mt-1">
            {errors[inputRef?.name].message}
          </small>
        )}
      </div>
    </>
  );
};

export default Checkbox;
