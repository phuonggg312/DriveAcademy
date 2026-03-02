import React from 'react';

// Comps
import {Link} from '@arctheme-components/elements/Link/Link';
import {Image as ResponsiveImage} from '@arctheme-components/elements/Image/Image';
import {Paragraph} from '@arctheme-components/elements/Paragraph/Paragraph';
import {Headings} from '@arctheme-components/elements/Headings/Headings';
import shopifyHelpers from 'frontend/js/shopify';

const AccountOrder = ({ order, locales, onClickClose }: { order: any; locales: any; onClickClose: () => void }) => {
  const handleClickBack = (event: React.ClickEvent<HTMLLinkElement>) => {
    event.preventDefault();

    onClickClose();
  };

  return (
    <div className='account-order'>
      <Link
        link={' '}
        classes='flex justify-start items-center gap-x-2 text-sm'
        onClick={handleClickBack}
      >
        <i className='icon-chevron-left text-xs'></i>
        <span>{locales.backToOrders}</span>
      </Link>

      <div className='my-6 space-y-2'>
        <Headings
          type='h2'
          text={shopifyHelpers.interpolateLocale(locales.title, { name: order.orderName })}
          classes='h5'
        />
        <Paragraph
          type='b2'
          text={`${shopifyHelpers.interpolateLocale(locales.orderPlacedOn, { date: order.createdAtWithTime })}`}
        />
        <Paragraph
          type='b2'
          text={`<strong>${locales.paymentStatus}:</strong> ${order.paymentStatus}`}
        />
        <Paragraph
          type='b2'
          text={`<strong>${locales.fulfillmentStatus}:</strong> ${order.fulfillmentStatus}`}
        />

        {order.cancelled && (
          <>
            <Paragraph
              type='b2'
              text={`${shopifyHelpers.interpolateLocale(locales.cancelled, { date: order.cancelledAt })}`}
            />
            <Paragraph
              type='b2'
              text={`${shopifyHelpers.interpolateLocale(locales.cancelledReason, { reason: order.cancelledReason })}`}
            />
          </>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>{locales.product}</th>
            <th>{locales.sku}</th>
            <th>{locales.price}</th>
            <th>{locales.quantity}</th>
            <th>{locales.total}</th>
          </tr>
        </thead>
        <tbody>
          {order.lineItems.map((item) => (
            <tr key={item.id}>
              <td
                data-label={locales.product}
                style={{ '--mobile-head': `"${locales.product}"` } as React.CSSProperties}
              >
                <div className='flex flex-col max-md:items-end'>
                  <div>
                    <Link
                      classes='flex items-center gap-x-2 underline'
                      link={item.url}
                    >
                      <ResponsiveImage
                        src={item.variant.featured_image.src}
                        baseWidth={80}
                        baseHeight={80}
                        alt={item.title}
                        classes='object-cover shrink-0 max-md:hidden'
                      />
                      <Paragraph
                        type='b3'
                        text={item.title}
                      />
                    </Link>
                  </div>

                  {item.fulfillment && item.fulfillment.createdAt && (
                    <ul>
                      <li>
                        <span>{locales.fulfilledAt}</span>
                        <span>{item.fulfillment.createdAt}</span>
                      </li>

                      {item.fulfillment.trackingUrl && (
                        <li>
                          <span>{locales.trackingUrl}</span>
                          <span>
                            <Link
                              link={item.fulfillment.trackingUrl}
                              classes='link--underlined !text-xs'
                              openInNewTab={true}
                            >
                              {locales.trackShipment}
                            </Link>
                          </span>
                        </li>
                      )}

                      <li>
                        <span>{locales.trackingCompany}</span>
                        <span>{item.fulfillment.trackingCompany}</span>
                      </li>

                      {item.fulfillment.trackingNumber && (
                        <li>
                          <span>{locales.trackingNumber}</span>
                          <span>{item.fulfillment.trackingNumber}</span>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </td>
              <td
                data-label={locales.sku}
                style={{ '--mobile-head': `"${locales.sku}"` } as React.CSSProperties}
              >
                {item.sku}
              </td>
              <td
                data-label={locales.price}
                style={{ '--mobile-head': `"${locales.price}"` } as React.CSSProperties}
              >
                {item.price}
              </td>
              <td
                data-label={locales.quantity}
                style={{ '--mobile-head': `"${locales.quantity}"` } as React.CSSProperties}
              >
                {item.quantity}
              </td>
              <td
                data-label={locales.total}
                style={{ '--mobile-head': `"${locales.total}"` } as React.CSSProperties}
              >
                {item.total}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={3}
              className='text-right'
            >
              {locales.subtotal}
            </td>
            <td
              colSpan={2}
              className='text-right'
              style={{ '--mobile-head': `"${locales.subtotal}"` } as React.CSSProperties}
            >
              {order.orderSubtotal}
            </td>
          </tr>
          {order.discounts.map((discount) => (
            <tr key={discount.code}>
              <td
                colSpan={3}
                className='text-right'
              >
                {locales.discount} ({discount.code})
              </td>
              <td
                colSpan={2}
                className='text-right'
                style={{ '--mobile-head': `"${locales.discount} (${discount.code})"` } as React.CSSProperties}
              >
                {discount.savings}
              </td>
            </tr>
          ))}
          {order.shippingMethods.map((method) => (
            <tr key={method.title}>
              <td
                colSpan={3}
                className='text-right'
              >
                {locales.shipping} ({method.title})
              </td>
              <td
                colSpan={2}
                className='text-right'
                style={{ '--mobile-head': `"${locales.shipping} (${method.title})"` } as React.CSSProperties}
              >
                {method.price}
              </td>
            </tr>
          ))}
          {order.taxLines.map((taxLine) => (
            <tr key={taxLine.title}>
              <td
                colSpan={3}
                DEV_2024-20_SS_2
                className='text-right'
              >
                ({taxLine.title} {taxLine.rate}%)
              </td>
              <td
                colSpan={2}
                className='text-right'
                style={{ '--mobile-head': `"(${taxLine.title} ${taxLine.rate}%)"` } as React.CSSProperties}
              >
                {taxLine.price}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={3}
              className='text-right'
            >
              {locales.total}
            </td>
            <td
              colSpan={2}
              className='text-right'
              style={{ '--mobile-head': `"${locales.total}"` } as React.CSSProperties}
            >
              {order.orderTotal}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className='grid lg:grid-cols-2 mt-6 gap-4'>
        <div>
          <Headings
            type='h3'
            text= {locales.shippingAddress}
            classes='h5 mb-3'
          />
          <Paragraph
            type='b2'
            text={shopifyHelpers.decodeLiquidEscape(order.shippingAddress)}
          />
        </div>

        <div>
          <Headings
            type='h3'
            classes='h5 mb-3'
          >
            {locales.billingAddress}
          </Headings>
          <Paragraph
            type='b2'
            text={shopifyHelpers.decodeLiquidEscape(order.billingAddress)}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountOrder;
