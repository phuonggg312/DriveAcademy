import React from 'react';

// Styles
import './AccountFields.scss';

// Comps
import {TextField} from '@arctheme-components/elements/TextField/TextField';
import {Checkbox} from '@arctheme-components/elements/Checkbox/Checkbox';
import Select from '@arctheme-components/elements/Select/Select';

type InputFieldProps = {
  id: string;
  inputType: 'text' | 'email' | 'tel' | 'number' | 'search' | 'password';
  placeholder?: string;
  value: string | number;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
};

type CustomFieldsProps = {
  customSignUpFields: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  values: any;
  valuesError?: any;
  fieldsWithError?: any;
};

export const InputField = ({ ...props }: InputFieldProps) => <ExtendedTextField {...props} />;

export const CheckboxField = ({ label, id, onChange }) => (
  <Checkbox
    label={label}
    name={id}
    id={id}
    onChange={onChange}
    checked={false}
  />
);

export const CustomFields = ({
  customSignUpFields,
  onChange,
  values,
  valuesError,
  fieldsWithError
}: CustomFieldsProps) => {
  return (
    <>
      {customSignUpFields.map((field) => {
        const { metafield_key, field_options, field_placeholder, is_required, name } = field;

        if (field_options && field_options.length > 0) {
          const options = field_options.map((option) => ({
            name: option,
            value: option
          }));

          return (
            <Select
              key={metafield_key}
              id={metafield_key}
              onChange={onChange}
              placeholder={field_placeholder}
              options={options}
              label={name}
              selected={values[metafield_key]}
              returnEvent={true}
              hasError={
                valuesError
                  ? valuesError[metafield_key]
                  : fieldsWithError
                    ? fieldsWithError.includes(metafield_key)
                    : false
              }
              errorMessage={valuesError ? `${name} is required` : ''}
            />
          );
        } else {
          return (
            <InputField
              key={metafield_key}
              inputType='text'
              id={metafield_key}
              name={metafield_key}
              value={values[metafield_key]}
              onChange={onChange}
              required={is_required}
              label={name}
              placeholder={field_placeholder}
              hasError={
                valuesError
                  ? valuesError[metafield_key]
                  : fieldsWithError
                    ? fieldsWithError.includes(metafield_key)
                    : false
              }
              errorMessage={valuesError ? `${name} is required` : ''}
            />
          );
        }
      })}
    </>
  );
};

export const BirthdayField = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (v, i) => currentYear - i);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return (
    <div className='account-page__input-group flex flex-col'>
      <label
        htmlFor='birthdayDay'
        className='account-page__label'
      >
        Birthday
      </label>
      <div className='account-page__input-container default-input flex space-x-4'>
        <select
          id='birthdayDay'
          name='birthdayDay'
          className='account-page__input form-field'
        >
          <option value='DD'>DD</option>
          {[...Array(31).keys()].map((day) => (
            <option
              key={day + 1}
              value={day + 1}
            >
              {String(day + 1).padStart(2, '0')}
            </option>
          ))}
        </select>

        <select
          id='birthdayMonth'
          name='birthdayMonth'
          className='account-page__input form-field'
        >
          <option value='MM'>MM</option>
          {months.map((month, idx) => (
            <option
              key={idx}
              value={String(idx + 1).padStart(2, '0')}
            >
              {month}
            </option>
          ))}
        </select>

        <select
          id='birthdayYear'
          name='birthdayYear'
          className='account-page__input form-field'
        >
          <option value='YYYY'>YYYY</option>
          {years.map((year) => (
            <option
              key={year}
              value={year}
            >
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
