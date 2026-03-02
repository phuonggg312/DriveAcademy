import React from 'react';

// Styles
import './account-sidebar.scss';

// Comps
import DropdownMenu from '@arctheme-components/blocks/DropdownMenu/DropdownMenu';

const AccountSidebar = ({ menu, colorSchema }) => {
  return (
    <div className='account-sidebar'>
      <DropdownMenu
        links={menu}
        colorSchema={colorSchema}
        hoverAnimation={true}
        disableDesktop={true}
        breakpoint={768}
      />
    </div>
  );
};

export default AccountSidebar;
