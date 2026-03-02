import React, { useState, useEffect } from 'react';
import useCustomerUpdate from "@arctheme-hooks/useCustomerUpdate";

export const AccountInformationDetails = ({ settings }) => {
    const { customer } = settings;
    const [firstName, setFirstName] = useState(customer.first_name || '');
    const [lastName, setLastName] = useState(customer.last_name || '');
    const [email, setEmail] = useState(customer.email || '');
    const [birthday, setBirthday] = useState('');
    const [tags, setTags] = useState('');
    const [hasFormChanged, setHasFormChanged] = useState(false);
    const { updateCustomer, loading: updateLoading, error: updateError, success: updateSuccess } = useCustomerUpdate();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Extract the tag string and birthday value from the customer tags
    useEffect(() => {
        const customerTags = customer.tags;

        const birthdayTag = customerTags.find(tag => tag.startsWith('birthday:'));
        if (birthdayTag) {
            const birthdayValue = birthdayTag.split(':')[1].trim();
            setBirthday(birthdayValue.charAt(0).toUpperCase() + birthdayValue.slice(1)); // Capitalize first letter
        }

        setTags(customerTags);
    }, [customer]);

    // Handle form submission
    const submitDetailsForm = async () => {
        console.log('Submitting form');
        await updateCustomer({
            firstName: firstName,
            lastName: lastName,
            tags: tags.join(',')
        });
    };

    // Handle form change detection
    useEffect(() => {
        setHasFormChanged(true);
    }, [firstName, lastName, birthday]);

    return (
        <div className="flex flex-col gap-4">
            <p className="b2">Personal Details</p>

            <form id="details-form" className="flex flex-col space-y-4">
                <input type="hidden" name="id" value={customer.id} />
                <input type="hidden" name="tags" value={tags} />

                <div className="flex flex-col lg:flex-row gap-x-5 gap-y-4">
                    <div className="floating-input w-full">
                        <input
                            className="py-2 px-4"
                            type="text"
                            name="first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder=" "
                        />
                        <label htmlFor="first_name">First Name</label>
                    </div>
                    <div className="floating-input w-full">
                        <input
                            className="py-2 px-4"
                            type="text"
                            name="last_name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder=" "
                        />
                        <label htmlFor="last_name">Last Name</label>
                    </div>
                </div>

                <div className="floating-input w-full">
                    <input
                        className="py-2 px-4 disabled-field"
                        type="email"
                        name="email"
                        value={email}
                        placeholder=" "
                        readOnly={true}
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <div className="floating-input">
                    <select
                        className="py-2 px-4 w-full lg:max-w-[374px]"
                        name="birthday"
                        value={`birthday:${birthday.toLowerCase()}`}
                        onChange={(e) => setBirthday(e.target.value.split(':')[1])}
                        required
                    >
                        <option hidden value=""></option>
                        {months.map((month) => (
                            <option
                                key={month}
                                value={`birthday:${month.toLowerCase()}`}
                                selected={birthday === month}
                            >
                                {month}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="birthday">Birthday</label>
                </div>

                {updateSuccess && <div className="form-success">Update successful!</div>}
                {updateError && <div className="errors">Error updating information</div>}

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        submitDetailsForm();
                    }}
                    className="button button-tertiary w-full lg:max-w-[280px]"
                    disabled={!hasFormChanged}
                >
                    {!updateLoading ? `Submit` : `Updating...`}
                </button>
            </form>
        </div>
    );
};

export default AccountInformationDetails;
