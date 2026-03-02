import React from 'react';

// Comps
import Address from '@project-stories/ecommerce/Account/AccountAddresses/Address';
import {Button} from '@arctheme-components/elements/Button/Button';
import {Paragraph} from '@arctheme-components/elements/Paragraph/Paragraph';

const AccountAddresses = ({
  addresses,
  deleteError,
  onClickEditOrAdd,
  onClickRemove,
  locales,
  defaultCountry
}: {
  addresses: any;
  deleteError: string;
  onClickEditOrAdd: (event: React.ClickEvent<HTMLAnchorElement>, address: any) => void;
  onClickRemove: (event: React.ClickEvent<HTMLAnchorElement>, addressId: number) => void;
  locales: any;
  defaultCountry?: string;
}) => {
  if (!addresses) return null;

  const sortedAddresses = addresses.sort((a, b) => {
    if (a.default && !b.default) {
      return -1;
    } else if (!a.default && b.default) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <div className={`${!addresses.length ? 'flex flex-col items-center' : ''}`}>
      {addresses.length ? (
          <div className='grid lg:grid-cols-2 gap-6'>
            {sortedAddresses.map((address, index) => (
              <Address
                key={address.id}
                address={address}
                isDefault={address.default}
                index={index}
                onClickEdit={onClickEditOrAdd}
                onClickRemove={onClickRemove}
                locales={locales}
              />
            ))}
          </div>
      ) : (
        <Paragraph
          type='b2 text-center'
          text={`<p>${locales.empty}</p>`}
        />
      )}

      {deleteError && (
        <Paragraph
          type='errors text-center mt-4'
          text={deleteError}
        />
      )}

      <Button
        type='button'
        label={locales.addNew}
        classes='btn-secondary mt-6'
        onClick={(e) =>
          onClickEditOrAdd(e, {
            first_name: '',
            last_name: '',
            company: '',
            address1: '',
            address2: '',
            city: '',
            province_code: '',
            zip: '',
            country: defaultCountry,
            id: null
          })
        }
      />
    </div>
  );
};

export default AccountAddresses;
