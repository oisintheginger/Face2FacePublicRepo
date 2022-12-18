import React from 'react';

type Props = {} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

const AvatarPlaceholder: React.FC<Props> = ({ className, ...props }) => {
  return (
    <span
      className={
        'inline-block h-24 w-24 overflow-hidden rounded-full bg-gray-100 ' +
        (className || '')
      }
      {...props}
    >
      <svg
        className="h-full w-full text-current"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  );
};

export default AvatarPlaceholder;
