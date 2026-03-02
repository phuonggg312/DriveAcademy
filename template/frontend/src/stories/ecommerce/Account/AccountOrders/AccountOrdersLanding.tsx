import React, { useState, lazy, Suspense } from 'react';

// Comps
import AccountSectionLayout from '@project-stories/ecommerce/Account/AccountSectionLayout';
import AccountOrders from '@project-stories/ecommerce/Account/AccountOrders/AccountOrders';
const AccountOrder = lazy(() => import('@project-stories/ecommerce/Account/AccountOrders/AccountOrder'));

// Styles
import './account-orders.scss';

const AccountOrdersLanding = ({ orders, locales }) => {
  const [activeOrder, setActiveOrder] = useState(null);

  const handleClickOrder = (event: React.ClickEvent<HTMLLinkElement>, order: any) => {
    event.preventDefault();

    setActiveOrder(order);
  };

  return (
    <AccountSectionLayout classes='p-6'>
      {activeOrder ? (
        <Suspense>
          <AccountOrder
            order={activeOrder}
            onClickClose={() => setActiveOrder(null)}
            locales={locales.order}
          />
        </Suspense>
      ) : (
        <AccountOrders
          orders={orders}
          onClickOrder={handleClickOrder}
          locales={locales.orders}
        />
      )}
    </AccountSectionLayout>
  );
};

export default AccountOrdersLanding;
