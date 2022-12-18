// @ts-nocheck
import React from 'react';
import {
  Slide,
  ToastClassName,
  ToastContainer,
  TypeOptions,
} from 'react-toastify';

const contextClass: Record<TypeOptions, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-gray-600',
  warning: 'bg-orange-400',
  default: 'bg-primary-600',
};

const MyToastContainer = () => {
  return (
    <ToastContainer
      limit={2}
      className="my-toast min-w-[24rem] max-w-[75vw]"
      position="top-right"
      toastClassName={({ type }: { type?: TypeOptions }) =>
        `${
          contextClass[type || 'default']
        } font-sans font-semibold relative flex p-3 min-h-[3rem] rounded-lg justify-between shadow-md overflow-hidden cursor-pointer` as unknown as ToastClassName
      }
      bodyClassName={() => 'text-sm font-white capitalize-first flex gap-4 p-3'}
      transition={Slide}
      autoClose={2500}
      hideProgressBar
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default MyToastContainer;
