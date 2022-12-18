import React, { PropsWithChildren } from 'react';

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="absolute left-0 flex min-h-screen w-full flex-row overflow-hidden font-sans text-sm">
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-900 bg-opacity-30 bg-[url('src/assets/img/app-auth-bg.jpg')] bg-cover bg-blend-overlay">
        <div className="flex min-w-[25%] flex-col justify-between rounded-xl bg-primary-50 bg-opacity-90 p-12 text-sm shadow-lg sm:p-12 xl:p-12 2xl:p-16">
          <div className="">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
