import {
  components as SelectComponents,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  IndicatorSeparatorProps,
  InputProps,
} from 'react-select';

export const MySelectControl: React.FC<
  ControlProps & {
    controlClasses?: string;
  }
> = (props) => {
  const { controlClasses } = props;

  return (
    <SelectComponents.Control
      className={`form-control-select capitalize-first pl-2 ${
        controlClasses || ''
      }`}
      {...props}
    />
  );
};

export const MyIndicatorSeparator: React.FC<IndicatorSeparatorProps> = ({
  innerProps,
}) => {
  return <span className="hidden" {...innerProps} />;
};

export const MyDropdownIndicator: React.FC<DropdownIndicatorProps> = (
  props
) => {
  return (
    <SelectComponents.DropdownIndicator {...props}>
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#prefix__clip0)">
          <path d="M7 9.5l5 5 5-5H7z" fill="#5B5B5B" />
        </g>
        <defs>
          <clipPath id="prefix__clip0">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
        </defs>
      </svg>
    </SelectComponents.DropdownIndicator>
  );
};

export const PlacesInput: React.ComponentType<
  InputProps<any, boolean, GroupBase<any>>
> = (props) => <SelectComponents.Input {...props} isHidden={false} />;
