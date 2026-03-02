import React from 'react';

// Comps
import {Link} from '@arctheme-components/elements/Link/Link';
import Paragraph from '@arctheme-components/elements/Paragraph/Paragraph';

const AccountOrders = ({
  orders,
  locales,
  onClickOrder
}: {
  orders: any;
  locales: any;
  onClickOrder: (event: React.ClickEvent<HTMLLinkElement>, order: any) => void;
}) => {
  return (
    <div className='account-orders'>
      {orders.length ? (
        <table>
          <thead>
            <tr>
              <th>{locales.order}</th>
              <th>{locales.date}</th>
              <th>{locales.paymentStatus}</th>
              <th>{locales.fulfillmentStatus}</th>
              <th>{locales.total}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderName}>
                <td
                  data-label={locales.order}
                  style={{ '--mobile-head': `"${locales.order}"` } as React.CSSProperties}
                >
                  <Link
                    link={' '}
                    classes='link--underlined'
                    onClick={(e) => onClickOrder(e, order)}
                  >
                    {order.orderName}
                  </Link>
                </td>
                <td
                  data-label={locales.date}
                  style={{ '--mobile-head': `"${locales.date}"` } as React.CSSProperties}
                >
                  {order.createdAt}
                </td>
                <td
                  data-label={locales.paymentStatus}
                  style={{ '--mobile-head': `"${locales.paymentStatus}"` } as React.CSSProperties}
                >
                  {order.paymentStatus}
                </td>
                <td
                  data-label={locales.fulfillmentStatus}
                  style={{ '--mobile-head': `"${locales.fulfillmentStatus}"` } as React.CSSProperties}
                >
                  {order.fulfillmentStatus}
                </td>
                <td
                  data-label={locales.total}
                  style={{ '--mobile-head': `"${locales.total}"` } as React.CSSProperties}
                >
                  {order.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Paragraph
          type='b2 text-center'
          text={locales.empty}
        />
      )}
    </div>
  );
};

export default AccountOrders;
