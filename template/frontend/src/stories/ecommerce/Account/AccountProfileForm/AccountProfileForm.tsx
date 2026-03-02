import React, { useState, useEffect, useMemo } from 'react';

// Comps
import { CustomFields, InputField } from '@project-stories/ecommerce/Account/AccountFields/AccountFields';
import {Paragraph} from '@arctheme-components/elements/Paragraph/Paragraph';
import ButtonSpinner from '@arctheme-components/blocks/ButtonSpinner/ButtonSpinner';
import AccountSectionLayout from '@project-stories/ecommerce/Account/AccountSectionLayout';

// Hooks
import { useGetCustomerQuery } from '@arctheme-hooks/useGetCustomerQuery';
import useCustomerUpdate from '@arctheme-hooks/useCustomerUpdate';

const AccountProfileForm = ({ section, signUpFields }) => {
  const {
    first_name_label,
    first_name_placeholder,
    last_name_label,
    last_name_placeholder,
    email_label,
    email_placeholder,
    button_label,
    button_style,
    success_message
  } = section;

  // Sort custom fields
  const customSignUpFields = signUpFields.sort((a, b) => {
    const orderA = a.field_order ? parseInt(a.field_order) : Infinity;
    const orderB = b.field_order ? parseInt(b.field_order) : Infinity;
    return orderA - orderB;
  });

  // Hooks
  const { fetchCustomer, customer } = useGetCustomerQuery();
  const {
    updateCustomer,
    loading: updateCustomerLoading,
    success: updateCustomerSuccess,
    error: updateCustomerError,
    fieldsWithError: updateCustomerFieldsWithError
  } = useCustomerUpdate();

  // States
  const initialDependenciesState = useMemo(() => {
    return Object.assign(
      {},
      {
        first_name: '',
        last_name: '',
        email: ''
      },
      ...customSignUpFields.map((field) => ({
        [field.metafield_key]: ''
      }))
    );
  }, [customer]);
  const [dependenciesState, setDependenciesState]: any = useState(initialDependenciesState);
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
    const updated = Object.keys(newData).some((key) => customer[key] !== newData[key]);

    setIsUpdated(updated);
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateCustomer(dependenciesState, (window as any).customer.id, customSignUpFields);
  };

  // Fetch customer
  useEffect(() => {
    fetchCustomer((window as any).customer.id, customSignUpFields);
  }, []);

  // And then pre-fill the fields
  useEffect(() => {
    if (customer) {
      for (const key in customer) {
        if (key in dependenciesState) {
          setDependenciesState((prev) => ({
            ...prev,
            [key]: customer[key]
          }));
        }
      }
    }
  }, [customer]);

  const showCustomFields = true;

  return (
    <AccountSectionLayout classes='p-6 lg:px-[152px] lg:pt-[52px] lg:pb-[141px]'>
      <form
        id='editForm'
        onSubmit={handleSubmit}
        className='account-page__form'
      >
        <div className='flex flex-col gap-y-4 items-center'>
          {/* First Name */}
          <InputField
            inputType='text'
            id='firstNameRegister'
            name='first_name'
            value={dependenciesState['first_name']}
            onChange={handleInputChange}
            required={true}
            label={first_name_label}
            placeholder={first_name_placeholder}
            hasError={updateCustomerFieldsWithError.includes('first_name')}
          />

          {/* Last Name */}
          <InputField
            inputType='text'
            id='lastNameRegister'
            name='last_name'
            value={dependenciesState['last_name']}
            onChange={handleInputChange}
            required={true}
            label={last_name_label}
            placeholder={last_name_placeholder}
            hasError={updateCustomerFieldsWithError.includes('last_name')}
          />

          {/* Email */}
          <InputField
            inputType='email'
            id='emailRegister'
            name='email'
            value={dependenciesState['email']}
            onChange={handleInputChange}
            required={true}
            label={email_label}
            placeholder={email_placeholder}
            hasError={updateCustomerFieldsWithError.includes('email')}
          />

          {/* Custom Fields */}
          {showCustomFields && (
            <CustomFields
              customSignUpFields={customSignUpFields}
              onChange={handleInputChange}
              values={dependenciesState}
              fieldsWithError={updateCustomerFieldsWithError}
            />
          )}

          {updateCustomerSuccess && (
            <Paragraph
              type='text-center success'
              text={success_message}
            />
          )}

          {updateCustomerError && (
            <Paragraph
              type='errors text-center'
              text={updateCustomerError}
            />
          )}

          <ButtonSpinner
            classes={`w-full ${button_style} h-[calc(3rem-2px)] text-base`}
            isLoading={updateCustomerLoading}
            ariaLabel='Submit edit profile form'
            disabled={!isUpdated}
          >
            {button_label}
          </ButtonSpinner>
        </div>
      </form>
    </AccountSectionLayout>
  );
};

export default AccountProfileForm;
