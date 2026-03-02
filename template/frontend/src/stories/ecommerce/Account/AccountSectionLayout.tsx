import React from 'react';

const AccountSectionLayout = ({ children, classes }: { children: React.ReactNode; classes?: string }) => {
  return (
    <div className={`bg-[#FFF] md:w-[420px] lg:w-[647px] ${classes}`}>
      {children}
    </div>
  );
};

export default AccountSectionLayout;
