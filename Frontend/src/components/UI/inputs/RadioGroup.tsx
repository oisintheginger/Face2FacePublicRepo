import React from 'react';
import { FieldValues, useController } from 'react-hook-form';
import {
  MyRadioGroupProps,
  SelectOption,
} from 'src/components/UI/inputs/interfaces';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';

export const MyRadioGroup = <T extends FieldValues>(
  props: MyRadioGroupProps<T>
) => {
  const {
    label,
    labelProps,
    id,
    errors,
    controllerProps: { control, defaultValue, name, shouldUnregister, rules },
    isMulti,
    options,
    groupClasses,
    radioItemClasses,
    radiosContainerClasses,
  } = props;

  const {
    field: { onChange: onSelectedChange, value, ...field },
  } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue,
    shouldUnregister,
  });

  const selectOptionHandler = (option: SelectOption['value']) => {
    const valueArr = [...value];

    if (isMulti) {
      if (valueArr.includes(option)) {
        const newValue = value.filter(
          (opt: SelectOption['value']) => opt !== option
        );
        onSelectedChange(newValue);
      } else {
        onSelectedChange(value.concat(option));
      }
    } else {
      onSelectedChange([option]);
    }
  };

  console.log(value, 'radiogroup val');

  return (
    <div className={`${groupClasses}`}>
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

      <RadioGroup
        id={id}
        value={value}
        onChange={selectOptionHandler}
        {...field}
      >
        <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
        <div className={`${radiosContainerClasses} `}>
          {options.map((option) => {
            const isSelected = value.includes(option.value);

            return (
              <RadioGroup.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `${
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-100'
                      : ''
                  }
                  ${
                    isSelected
                      ? 'border-[2px] border-primary-600 bg-primary-200 bg-opacity-70  text-white'
                      : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-3 shadow-md focus:outline-none ${radioItemClasses}`
                }
              >
                {({ active }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`text-sm font-medium  ${
                              isSelected ? 'text-primary-700' : 'text-gray-800'
                            }`}
                          >
                            {option.label}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex shrink-0 flex-col items-center justify-center rounded-full bg-primary-800 p-1">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            );
          })}
        </div>
      </RadioGroup>

      {!!errors?.[name] && (
        <small className="form-error ml-3">{`${errors?.[name]?.message}`}</small>
      )}
    </div>
  );
};

export default MyRadioGroup;
