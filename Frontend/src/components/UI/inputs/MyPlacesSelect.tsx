import { FieldValues, useController } from 'react-hook-form';
import { MyReactPlacesSelectProps } from 'src/components/UI/inputs/interfaces';
import Select from 'react-select/async';
import { StylesConfig } from 'react-select';
import {
  MySelectControl,
  MyIndicatorSeparator,
  PlacesInput,
} from 'src/components/UI/inputs/SelectComponents/SelectComponents';

const MyPlacesSelect = <T extends FieldValues>(
  props: MyReactPlacesSelectProps<T>
) => {
  const {
    errors,
    id,
    label,
    placeholder,
    prefix,
    labelProps,
    suggestions,
    setSearchValue,
    onSelectPlace,
    groupClasses,
    controlClasses,
    controllerProps: { control, defaultValue, name, shouldUnregister, rules },
    ...selectProps
  } = props;

  const {
    field: { onChange, value, ...field },
  } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue,
    shouldUnregister,
  });

  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    setTimeout(() => {
      const displayOptions = suggestions?.map((suggestion) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        return {
          label: (
            <div key={place_id}>
              <strong>{main_text}</strong> <small>{secondary_text}</small>
            </div>
          ),
          value: place_id,
          description: suggestion.description,
        };
      });

      callback(displayOptions);
    }, 1);
  };

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
          DropdownIndicator: null,
          Control: MySelectControl,
          Input: PlacesInput,
        }}
        // id={name}
        placeholder={placeholder || ''}
        controlShouldRenderValue={false}
        classNamePrefix={'autoselect'}
        defaultOptions={[]}
        loadOptions={loadOptions}
        cacheOptions={false}
        // controlShouldRenderValue={false}
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
        hideSelectedOptions={false}
        noOptionsMessage={() => null}
        loadingMessage={() => null}
        defaultValue={defaultValue || ''}
        blurInputOnSelect={true}
        onChange={(newVal, action) => {
          if (action.action === 'select-option') {
            onChange(newVal);
            onSelectPlace(newVal);
          }
          if (action.action === 'clear') {
            onChange(null);
            setSearchValue('');
          }
        }}
        onInputChange={(newVal, action) => {
          if (action.action === 'input-change') {
            setSearchValue(newVal);
          }
        }}
        isSearchable
        isClearable
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
  option: (provided: any, { isFocused, isSelected }: any) => ({
    ...provided,
    padding: '0.75rem 1.25rem',
    fontWeight: 500,
    fontSize: 'max(11px,0.875rem)',
  }),
  multiValue: (provided: any, { isFocused }: any) => ({
    ...provided,
    backgroundColor: 'rgba(235, 107, 67, 1)',
    color: 'white',
    borderRadius: 5,
    padding: '0.15rem 0.35rem',
  }),
  multiValueLabel: (provided: any, { isFocused }: any) => ({
    ...provided,
    color: 'white',
    fontWeight: 600,
  }),
  dropdownIndicator: (provided: any, { isFocused }: any) => ({
    ...provided,
    padding: '0.4rem',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0.125rem 0.25rem',
  }),
};

export default MyPlacesSelect;
