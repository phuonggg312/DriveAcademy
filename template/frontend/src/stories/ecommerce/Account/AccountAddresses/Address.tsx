import React from 'react';

// Comps
import {Headings} from '@arctheme-components/elements/Headings/Headings';
import {Link} from '@arctheme-components/elements/Link/Link';

const Address = ({
  address,
  isDefault,
  index,
  onClickEdit,
  onClickRemove,
  locales
}: {
  address: any;
  isDefault: boolean;
  index: number;
  onClickEdit: (event: React.ClickEvent<HTMLAnchorElement>, address: any) => void;
  onClickRemove: (event: React.ClickEvent<HTMLAnchorElement>, addressId: number) => void;
  locales: any;
}) => {
  const { first_name, last_name, company, address1, address2, city, province_code, zip, country } = address;

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex flex-col gap-y-1'>
        <Headings
          type='h3'
          text={isDefault ? locales.defaultAddress : `Address ${index + 1}`}
          classes='h5 opacity-40'
        />

        <p className=''>
          {(first_name || last_name) && (
            <>
              {first_name} {last_name}
              <br />
            </>
          )}
          {company && (
            <>
              {company}
              <br />
            </>
          )}
          {address1 && (
            <>
              {address1}
              <br />
            </>
          )}
          {address2 && (
            <>
              {address2}
              <br />
            </>
          )}
          {(city || province_code || zip) && (
            <>
              {city} {province_code} {zip}
              <br />
            </>
          )}
          {country && (
            <>
              {country}
              <br />
            </>
          )}
        </p>
      </div>
      <div className='flex gap-x-2'>
        <Link
          link={' '}
          classes='link--underlined'
          onClick={(e) => onClickEdit(e, address)}
        >
          {locales.edit}
        </Link>
        <Link
          link={' '}
          classes='link--underlined'
          onClick={(e) => onClickRemove(e, address.id)}
        >
          {locales.delete}
        </Link>
      </div>
    </div>
  );
};

export default Address;
