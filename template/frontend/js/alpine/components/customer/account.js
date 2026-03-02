import shopifyHelper from "../../../shopify";
import {hasher } from "../../stores/hasher";

import UPDATE_CUSTOMER_DETAILS from '../../../graphql/2024_01/customer/update.graphql';

export const account = {
    name: 'account',
    component() {
        return {
            open: false,
            hashChangedCount: 0,
            view: null,
            detailsForm: null,
            hasFormChanged: false,
            useAuthenticated: true,
            updatedSuccessfully: false,
            updatedError: false,
            processing: false,
            successMessage: "Your details have been updated.",
            errorMessage: "There was a problem updating your details.",
            init() {
                this.useAuthenticated = true;
                window.addEventListener('hashchange', this.updateHashChangedCount);

                this.detailsForm = document.getElementById("details-form");
                this.detailsForm.addEventListener('input', this.handleInputChanged.bind(this));
            },
            handleInputChanged(){
                this.hasFormChanged = true;
                console.log('formChanged - event', this.hasFormChanged);
            },
            async submitDetailsForm(event) {
                // event.preventDefault();
                this.detailsForm = document.getElementById("details-form");
                this.updatedSuccessfully = false;
                const formData = new FormData(this.detailsForm);
                this.processing = true;
                console.log('id', formData.get('id'));
                console.log('first', formData.get('first_name'));
                console.log('last', formData.get('last_name'));
                console.log('email', formData.get('email'));
                console.log('birthday', formData.get('birthday'));
                console.log('tags - form', formData.get('tags'));

                const tags = formData.get('tags').split(',');
                const newBirthday = formData.get('birthday');

                // Find the index of the existing birthday tag
                const birthdayTagIndex = tags.findIndex(tag => tag.startsWith('birthday:'));

                // Replace or add the birthday tag
                if (birthdayTagIndex !== -1) {
                    tags[birthdayTagIndex] = newBirthday;
                } else {
                    tags.push(newBirthday);
                }

                console.log('tags array', tags);
                await hasher.store().dispatchHash();
                const body = JSON.stringify({
                    query: UPDATE_CUSTOMER_DETAILS.loc.source.body,
                    variables: {
                        input: {
                            id: `gid://shopify/Customer/${formData.get('id')}`,
                            firstName: `${formData.get('first_name')}`,
                            lastName: `${formData.get('last_name')}`,
                            tags: tags
                        }
                    }
                });
                let data = {
                    options: {
                        method: 'POST',
                        headers: {
                            'X-Shopify-Access-Token': '<SHOPIFY_API_AUTHENTICATED_KEY>',
                            'Content-Type': 'application/json',
                            'X-MindArc-Hash': hasher.store().getHash()
                        },
                        body: body,
                        request_body: UPDATE_CUSTOMER_DETAILS.loc.source.body,
                    }
                }

                let jsonResponse = null;
                console.log('Account', 'Using Authenticated Request');
                jsonResponse = await shopifyHelper.authenticatedFetch(data);

                console.log('Account', jsonResponse);

                if (jsonResponse.data.customerUpdate.userErrors.length <= 0){
                    this.updatedSuccessfully = true;
                } else {
                    this.updatedError = true;
                }
                this.processing = false;
                this.response = jsonResponse;
                return jsonResponse;
                this.hasFormChanged = false;
            },
            updateHashChangedCount() {
                this.hashChangedCount++
            },
            isActive(url) {
                const { hash, pathname } = window.location;
                let linkURL = url;

                if (url[0] === '#') {
                    linkURL = `${pathname}${url}`;
                }

                return `${pathname}${hash}` === linkURL;
            },
            toggleView(url) {
                const viewUrl = url.split('?'); // Split the URL at the '?' character
                let temp = [];

                // Iterate over each item in the viewUrl array
                viewUrl.forEach(item => {
                    // Split each item at the '=' character and push it into the temp array
                    const params = item.split('=');
                    if (params.length === 2 && params[0] === 'view') {
                        temp = params;
                    }
                });

                // Set this.view to the value after '='
                this.view = temp[1] || null;
            },
            isActiveAccount (url) {
                // eslint-disable-next-line no-undef
                const urlParams = new URLSearchParams(document.location.search);
                const view = urlParams.get("view");
                const splitPassedURL = url.split('?');
                const passedParams = {};

                // eslint-disable-next-line no-unexpected-multiline
                splitPassedURL.forEach(item => {
                    const temp = item.split('=');
                    passedParams[temp[0]] = temp[1] ? temp[1] : null;
                })

                // IF neither URL value has any VIEW parameters AND there is an /account parameter, this is the default account dashboard
                if (!view && !passedParams.view && Object.keys(passedParams).indexOf('/account') > -1) {
                    return true;
                } else if (view && passedParams.view) {
                    // otherwise if both have VIEW parameter values, match them VIEW parameters to confirm the page we are on
                    return view === passedParams.view;
                }
            }
        }
    }
};

export default account;
