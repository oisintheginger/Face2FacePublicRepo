import React from 'react';
import { InputProps } from './interfaces';
import { get } from 'lodash';

const Input: React.FC<InputProps> = (props) => {
  const {
    id,
    errors,
    inputRef,
    label,
    groupClasses,
    labelProps,
    className,
    children,
    name,
    ...inputProps
  } = props;

  return (
    <div className={`input-group ${groupClasses || ''}`}>
      {label && (
        <label
          htmlFor={id}
          {...(labelProps && { ...labelProps })}
          className={`mb-2 block text-sm font-semibold ${
            labelProps?.className || ''
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={'text'}
          id={id}
          name={inputRef?.name || name}
          {...inputRef}
          className={`form-control-input ${className || ''}`}
          {...inputProps}
        />
        {children}
      </div>

      {get(errors, inputRef?.name || id) && (
        <small className="form-error ml-3">
          {get(errors, inputRef?.name || id).message}
        </small>
      )}
    </div>
  );
};

export default Input;
