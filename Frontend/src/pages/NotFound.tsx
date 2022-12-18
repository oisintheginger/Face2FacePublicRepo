import React from 'react';
import { Link } from 'react-router-dom';

type Props = {};

const NotFound = (props: Props) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center pb-36">
      <h2 className="mb-10">It seems we have lost you!</h2>
      <p>
        <Link to="/" className="text-primary">
          Click to go to the home page
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
