import React, { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import Button from 'src/components/UI/Button/Button';

type LoadableProps = {
  isLoading: boolean;
  isError: boolean;
};

const Loadable: React.FC<PropsWithChildren<LoadableProps>> = ({
  isError,
  isLoading,
  children,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center pb-[20vh]">
        <span className="sr-only">Loading...</span>
        <HashLoader loading={isLoading} color="#9C515C" size={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="mb-5">Unfortunately an error as occurred</h1>
        <Button
          variant="link"
          text="Click here to refresh"
          onClick={() => {
            navigate(0);
          }}
        />
        <Button
          variant="link"
          className="mt-7 text-gray-600"
          text="Click here to return to home"
          onClick={() => {
            navigate('/');
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default Loadable;
