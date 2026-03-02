import React, { useState, useEffect } from 'react';

// Comps
import { InputField } from '@project-stories/ecommerce/Account/AccountFields/AccountFields';
import Select from '@arctheme-components/elements/Select/Select';
import {Checkbox} from '@arctheme-components/elements/Checkbox/Checkbox';
import ButtonSpinner from '@arctheme-components/blocks/ButtonSpinner/ButtonSpinner';
import {Button} from '@arctheme-components/elements/Button/Button';
import {Link} from '@arctheme-components/elements/Link/Link';
import {Paragraph} from '@arctheme-components/elements/Paragraph/Paragraph';

const AddressForm = ({
  address,
  countries,
  provinces,
  newForm,
  shopifyCustomerId,
  getProvinces,
  onClickCancel,
  updateCustomerAddress,
  updatingAddress,
  updateError,
  updateSuccess,
  addCustomerAddress,
  addingAddress,
  addError,
  addSuccess,
  locales,
}: {
  address: any;
  countries: any;
  provinces: any;
  newForm: boolean;
  shopifyCustomerId: number;
  getProvinces: (countryCode: string) => void;
  onClickCancel: (event: React.ClickEvent) => void;
  updateCustomerAddress: (customerId: number, addressId: number, addressData: any) => Promise<{ success: boolean }>;
  updatingAddress: boolean;
  updateError: string;
  updateSuccess: boolean;
  addCustomerAddress: (customerId: number, addressData: any) => Promise<{ success: boolean }>;
  addingAddress: boolean;
  addError: string;
  addSuccess: boolean;
  locales: any;
}) => {
  const { first_name, last_name, company, address1, address2, city, province_code, zip, country } = address;

  // States
  const initialDependenciesState = {
    first_name,
    last_name,
    company,
    address1,
    address2,
    city,
    province_code,
    zip,
    country
  };
  const [dependenciesState, setDependenciesState]: any = useState(initialDependenciesState);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  // Handle input change and update global dependency state
  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    // For checkboxes, use the checked value, otherwise use the input value
    const newValue = inputType === 'checkbox' ? checked : value;

    // Update the global dependency state
    updateDependencyState(name, newValue);
  };

  // Function to update the global dependencies state
  const updateDependencyState = (name, value) => {
    const newData = {
      ...dependenciesState,
      [name]: value
    };

    setDependenciesState(newData);
    toggleIsUpdated(newData);
  };

  const toggleIsUpdated = (newData) => {
    const updated = Object.keys(newData).some((key) => address[key] !== newData[key]);

    setIsUpdated(updated);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const provinceCode = dependenciesState['province_code'];
    const countryName = dependenciesState['country'];
    const data = {
      ...dependenciesState,
      country_code: countries.find((country) => country.name === countryName).code,
      province: provinceCode && provinces ? provinces.find((province) => province.code === provinceCode).name : '',
      default: isDefaultAddress
    };

    let isSuccess = false;

    if (!newForm) {
      const { success } = await updateCustomerAddress(shopifyCustomerId, address.id, data);
      isSuccess = success;
    } else {
      const { success } = await addCustomerAddress(shopifyCustomerId, data);
      isSuccess = success;
    }

    if (isSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get provinces based on selected country
  useEffect(() => {
    const countryData = countries.find((country) => country.name === dependenciesState.country);

    if (countryData) {
      getProvinces(countryData.code);
    }
  }, [dependenciesState]);

  useEffect(() => {
    if (!provinces) return;

    if (!provinces.length) {
      setDependenciesState((prev) => ({
        ...prev,
        province_code: ''
      }));
    } else {
      const currentProvince = dependenciesState['province_code'];

      if (!currentProvince) {
        setDependenciesState((prev) => ({
          ...prev,
          province_code: provinces[0].code
        }));
      }
    }
  }, [provinces]);

  const countryOptions = countries.map((country) => ({
    name: country.name,
    value: country.name
  }));
  const provinceOptions = provinces?.map((province) => ({
    name: province.name,
    value: province.code
  }));

  return (
    <>
      {updateSuccess || addSuccess ? (
        <div className='flex flex-col items-center gap-y-4'>
          <Paragraph
            type='text-center text-base'
            text={newForm ? locales.successAdd : locales.successUpdate}
          />

          <Button
            type='button'
            classes='btn-outline'
            onClick={onClickCancel}
          >
            {locales.back}
          </Button>
        </div>
      ) : (
        <>
          <Link
            link={' '}
            classes='flex justify-start items-center gap-x-2 text-sm mb-6'
            onClick={(e) => onClickCancel(e)}
          >
            <i className='icon-chevron-left text-xs'></i>
            <span>{locales.backToAddresses}</span>
          </Link>

          <form
            id='addressForm'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col gap-y-4 items-center'>
              <div className='w-full grid lg:grid-cols-2 gap-4'>
                {/* First Name */}
                <InputField
                  inputType='text'
                  id='firstNameAddress'
                  name='first_name'
                  value={dependenciesState['first_name']}
                  onChange={handleInputChange}
                  label={locales.firstName}
                  placeholder={locales.firstName}
                />

                {/* Last Name */}
                <InputField
                  inputType='text'
                  id='lastNameAddress'
                  name='last_name'
                  value={dependenciesState['last_name']}
                  onChange={handleInputChange}
                  label={locales.lastName}
                  placeholder={locales.lastName}
                />
              </div>

              {/* Company */}
              <InputField
                inputType='text'
                id='companyAddress'
                name='company'
                value={dependenciesState['company']}
                onChange={handleInputChange}
                label={locales.company}
                placeholder={locales.company}
              />

              {/* Address1 */}
              <InputField
                inputType='text'
                id='address1Address'
                name='address1'
                value={dependenciesState['address1']}
                onChange={handleInputChange}
                label={locales.address1}
                placeholder={locales.address1}
              />

              {/* Address2 */}
              <InputField
                inputType='text'
                id='address2Address'
                name='address2'
                value={dependenciesState['address2']}
                onChange={handleInputChange}
                label={locales.address2}
                placeholder={locales.address2}
              />

              {/* City */}
              <InputField
                inputType='text'
                id='cityAddress'
                name='city'
                value={dependenciesState['city']}
                onChange={handleInputChange}
                label={locales.city}
                placeholder={locales.city}
              />

              {/* Country */}
              <Select
                id='country'
                onChange={handleInputChange}
                options={countryOptions}
                label={locales.country}
                placeholder={locales.country}
                selected={dependenciesState['country']}
                returnEvent={true}
              />

              {/* State */}
              {provinceOptions && provinceOptions.length > 0 && (
                <Select
                  id='province_code'
                  onChange={handleInputChange}
                  options={provinceOptions}
                  label={locales.province}
                  placeholder={locales.province}
                  selected={dependenciesState['province_code']}
                  returnEvent={true}
                />
              )}

              {/* Zip */}
              <InputField
                inputType='text'
                id='zipAddress'
                name='zip'
                value={dependenciesState['zip']}
                onChange={handleInputChange}
                label={locales.zip}
                placeholder={locales.zip}
              />

              <Checkbox
                id='defaultAddress'
                label={locales.setAsDefault}
                checked={isDefaultAddress}
                onChange={() => setIsDefaultAddress((prev) => !prev)}
              />

              {(updateError || addError) && (
                <Paragraph
                  type='errors text-center'
                  text={updateError || addError}
                />
              )}

              <div className='grid grid-cols-2 gap-4 w-full '>
                <ButtonSpinner
                  isLoading={updatingAddress || addingAddress}
                  classes={`btn-secondary w-full`}
                  ariaLabel='Submit address form'
                  disabled={!isUpdated && !isDefaultAddress}
                >
                  {newForm ? locales.add : locales.update}
                </ButtonSpinner>

                <Button
                  type='button'
                  classes='btn-primary'
                  ariaLabel='Back to delivery addresses'
                  onClick={onClickCancel}
                >
                  {locales.cancel}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default AddressForm;
