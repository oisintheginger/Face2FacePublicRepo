import { FieldValues, useController } from 'react-hook-form';
import { MyReactSelectProps } from 'src/components/UI/inputs/interfaces';
import Select, { StylesConfig } from 'react-select';
import {
  MySelectControl,
  MyIndicatorSeparator,
  MyDropdownIndicator,
} from 'src/components/UI/inputs/SelectComponents/SelectComponents';

export const MyReactSelect = <T extends FieldValues>(
  props: MyReactSelectProps<T>
) => {
  const {
    errors,
    id,
    label,
    components,
    placeholder,
    prefix,
    labelProps,
    options,
    isSearchable,
    groupClasses,
    controlClasses,
    controllerProps: { control, defaultValue, name, shouldUnregister, rules },
    ...selectProps
  } = props;

  const { field } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue,
    shouldUnregister,
  });

  return (
    <div className={`select-group ${groupClasses || ''}`}>
      {label && (
        <label
          htmlFor={name}
          {...(labelProps && { ...labelProps })}
          className={`mb-2 block text-sm font-semibold ${
            labelProps?.className || ''
          }`}
        >
          {label}
        </label>
      )}

      <Select
        components={{
          IndicatorSeparator: MyIndicatorSeparator,
          DropdownIndicator: MyDropdownIndicator,
          Control: (props) => (
            <MySelectControl controlClasses={controlClasses} {...props} />
          ),
        }}
        id={name}
        placeholder={placeholder || ''}
        // classNamePrefix={prefix || ''}
        options={options}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: 'rgba( 156, 81, 92, 1)',
            primary25: 'rgba( 156, 81, 92, 0.25)',
            primary50: 'rgba( 156, 81, 92, 0.5)',
            primary75: 'rgba( 156, 81, 92, 0.75)',
          },
        })}
        styles={customStyles}
        isSearchable={isSearchable || false}
        isClearable
        hideSelectedOptions={false}
        defaultValue={defaultValue || ''}
        {...selectProps}
        {...field}
      />
      {!!errors?.[name] && (
        <small className="form-error ml-3">{`${errors?.[name]?.message}`}</small>
      )}
    </div>
  );
};

const customStyles: StylesConfig<any, boolean, any> = {
  option: (provided, { isFocused, isSelected }) => ({
    ...provided,
    padding: '0.75rem 1.25rem',
    fontWeight: 500,
    fontSize: 'max(11px,0.875rem)',
  }),
  multiValue: (provided, { isFocused }) => ({
    ...provided,
    backgroundColor: 'rgba(235, 107, 67, 1)',
    color: 'white',
    borderRadius: 5,
    padding: '0.15rem 0.35rem',
  }),
  multiValueLabel: (provided, { isFocused }) => ({
    ...provided,
    color: 'white',
    fontWeight: 600,
  }),
  dropdownIndicator: (provided, { isFocused }) => ({
    ...provided,
    padding: '0.4rem',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0.125rem 0.25rem',
  }),
};

export default MyReactSelect;
