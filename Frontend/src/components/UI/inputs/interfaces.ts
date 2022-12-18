import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegisterReturn,
  FieldErrors,
  UseControllerProps,
} from 'react-hook-form';
import { GroupBase, Props as ReactSelectProps } from 'react-select';
import { AsyncProps as ReactAsyncSelectProps } from 'react-select/async';

interface RHFInputProps {
  name?: string | `${string}.${string}` | `${string}.${number}`;
  label?: string;
  errors?: DeepMap<FieldValues, FieldError>;
  inputRef?: UseFormRegisterReturn;
  groupClasses?: string;
  labelProps?: {
    [x: string]: string | object;
    className: string;
  };
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    RHFInputProps {
  id: string | `${string}.${string}` | `${string}.${number}`;
}

export interface SelectOption {
  readonly value: string | number;
  readonly label: string | JSX.Element;
  disabled?: boolean;
}

export interface MyReactSelectProps<T extends FieldValues>
  extends ReactSelectProps<any, boolean> {
  options: readonly SelectOption[];
  label?: string;
  errors?: FieldErrors;
  groupClasses?: HTMLDivElement['className'];
  controlClasses?: string;
  labelProps?: {
    [x: string]: string | object;
    className: string;
  };
  controllerProps: UseControllerProps<T>;
  placeholder?: React.ReactNode;
  prefix?: string;
  isSearchable?: boolean;
}

export interface MyReactPlacesSelectProps<T extends FieldValues>
  extends ReactAsyncSelectProps<any, boolean, GroupBase<any>> {
  suggestions: any[];
  label?: string;
  errors?: FieldErrors;
  groupClasses?: HTMLDivElement['className'];
  controlClasses?: string;
  labelProps?: {
    [x: string]: string | object;
    className: string;
  };
  setSearchValue: (value: string) => void;
  onSelectPlace: (res: { description: string } & SelectOption) => void;
  controllerProps: UseControllerProps<T>;
  placeholder?: React.ReactNode;
  prefix?: string;
  isSearchable?: boolean;
}

export interface MyRadioGroupProps<T extends FieldValues> {
  label: string;
  id: string | `${string}.${string}` | `${string}.${number}`;
  labelProps?: {
    [x: string]: string | object;
    className: string;
  };
  groupClasses: HTMLDivElement['className'];
  radiosContainerClasses?: HTMLDivElement['className'];
  radioItemClasses?: HTMLDivElement['className'];
  options: readonly SelectOption[];
  errors: FieldErrors;
  controllerProps: UseControllerProps<T>;
  isMulti?: boolean;
}

export interface MyTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    RHFInputProps {
  id: string | `${string}.${string}` | `${string}.${number}`;
}
