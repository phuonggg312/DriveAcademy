import React, { useState, useRef } from 'react';

// Comps
import AccountSectionLayout from '@project-stories/ecommerce/Account/AccountSectionLayout';
import { InputField } from '@project-stories/ecommerce/Account/AccountFields/AccountFields';
import ButtonSpinner from '@arctheme-components/blocks/ButtonSpinner/ButtonSpinner';
import Paragraph from '@arctheme-components/elements/Paragraph/Paragraph';

// Hooks
import useCustomerUpdatePassword from '@arctheme-hooks/useCustomerUpdatePassword';
import useCustomerAccessToken from '@arctheme-hooks/useCustomerAccessToken';

const AccountChangePassword = ({ section }) => {
  const {
    new_password_label,
    new_password_placeholder,
    confirm_password_label,
    confirm_password_placeholder,
    button_label,
    button_style,
    success_message
  } = section;

  // Refs
  const formRef = useRef(null);

  // Hooks
  const { useAccessToken } = useCustomerAccessToken();
  const { updateCustomerPassword, error, loading, success } = useCustomerUpdatePassword(formRef.current);

  // States
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const customerAccessToken = useAccessToken();
    if (customerAccessToken) {
      updateCustomerPassword(password, passwordConfirm, customerAccessToken);
    }
  };

  return (
    <AccountSectionLayout classes='p-6 lg:px-[152px] lg:pt-[52px] lg:pb-[75px]'>
      <form
        id='changePasswordForm'
        onSubmit={handleSubmit}
        ref={formRef}
        action='/account/login'
      >
        <div className='flex flex-col gap-y-4 items-center'>
          {/* New Password */}
          <InputField
            inputType='password'
            id='passwordChangePassword'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            label={new_password_label}
            placeholder={new_password_placeholder}
          />

          {/* Confirm Password */}
          <InputField
            inputType='password'
            id='passwordChangePasswordConfirm'
            name='password-confirm'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required={true}
            label={confirm_password_label}
            placeholder={confirm_password_placeholder}
          />

          {success && (
            <Paragraph
              type='text-center success'
              text={success_message}
            />
          )}

          {error && (
            <Paragraph
              type='errors text-center'
              text={error}
            />
          )}

          <ButtonSpinner
            isLoading={loading}
            classes={`${button_style} w-full h-[calc(3rem-2px)] text-base`}
          >
            {button_label}
          </ButtonSpinner>
        </div>
      </form>
    </AccountSectionLayout>
  );
};

export default AccountChangePassword;
