import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

const EyeAppend = (props: { visible: boolean; toggle: () => void }) => {
  const { visible, toggle } = props;

  return (
    <div
      className="absolute inset-y-0 right-0 flex items-center pr-5 transition-all"
      onClick={() => toggle()}
      role="button"
      aria-roledescription="toggle password visibility"
      title={visible ? 'Hide Password' : 'Show Password'}
    >
      {visible ? (
        <EyeSlashIcon className="h-4 w-4 text-gray-700" />
      ) : (
        <EyeIcon className="h-4 w-4 text-gray-700" />
      )}
    </div>
  );
};

export default EyeAppend;
