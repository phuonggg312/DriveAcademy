import React, { useEffect, useState, lazy, Suspense } from 'react';

// Comps
import AccountSectionLayout from '@project-stories/ecommerce/Account/AccountSectionLayout';
const AddressForm = lazy(() => import('@project-stories/ecommerce/Account/AccountAddresses/AddressForm'));
import Preloader from '@arctheme-components/blocks/Preloader/Preloader';
import AccountAddresses from '@project-stories/ecommerce/Account/AccountAddresses/AccountAddresses';

// Hooks
import useCustomerAddress from '@arctheme-hooks/useCustomerAddress';

const AccountAddressesLanding = ({ defaultCountry, locales }) => {
  const shopifyCustomerId = (window as any).customer.id;

  // States
  const [editAddress, setEditAddress] = useState(null);

  // Hooks
  const {
    fetchCustomerAddresses,
    fetchProvincesFromCountry,
    updateCustomerAddress,
    addCustomerAddress,
    removeAddress,
    resetStates,

    addresses,
    countries,
    provinces,
    fetchingAddresses,
    updatingAddress,
    updateError,
    updateSuccess,
    addingAddress,
    addError,
    addSuccess,
    deleteError
  } = useCustomerAddress();

  const defaultCountryName = countries?.find((country) => country.code === defaultCountry)?.name;

  const handleClickEditOrAdd = (event: React.ClickEvent<HTMLAnchorElement>, address: any) => {
    event.preventDefault();

    setEditAddress(address);
  };

  const handleClickRemove = (event: React.ClickEvent<HTMLAnchorElement>, addressId: number) => {
    event.preventDefault();
    if (window.confirm(locales.addresses.deleteConfirm)) {
      removeAddress(shopifyCustomerId, addressId);
    }
  };

  const closeAddressForm = (event: React.ClickEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setEditAddress(null);
    resetStates();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchCustomerAddresses(shopifyCustomerId);
  }, []);

  return (
    <AccountSectionLayout classes='p-6'>
      {editAddress ? (
        <Suspense>
          <AddressForm
            address={editAddress}
            countries={countries}
            provinces={provinces}
            getProvinces={fetchProvincesFromCountry}
            newForm={!editAddress.id}
            onClickCancel={closeAddressForm}
            shopifyCustomerId={shopifyCustomerId}
            updateCustomerAddress={updateCustomerAddress}
            updatingAddress={updatingAddress}
            updateError={updateError}
            updateSuccess={updateSuccess}
            addCustomerAddress={addCustomerAddress}
            addingAddress={addingAddress}
            addError={addError}
            addSuccess={addSuccess}
            locales={locales.addresses}
          />
        </Suspense>
      ) : fetchingAddresses ? (
        <Preloader loadingText='Loading addresses...' />
      ) : (
        <AccountAddresses
          addresses={addresses}
          onClickEditOrAdd={handleClickEditOrAdd}
          onClickRemove={handleClickRemove}
          deleteError={deleteError}
          locales={locales.addresses}
          defaultCountry={defaultCountryName}
        />
      )}
    </AccountSectionLayout>
  );
};

export default AccountAddressesLanding;
