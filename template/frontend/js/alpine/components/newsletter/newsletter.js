export default {
    name: 'newsletter',
    component() {
        return {
            isNewsletterOpen: false,
            isSuccess: false,
            serverMessage: false,
            isSubmitting: false,

            toggleNewsletter() {
                this.isNewsletterOpen = !this.isNewsletterOpen;
            },

            async subscribe(email) {
                const valid = true;

                if (valid) {
                    console.log('Form is valid');
                    console.log('Submitting new subscriber details to Shopify');

                    const myForm = document.querySelector('#at-newsletter-subscribe-form');
                    window.Shopify.captcha.protect(myForm, () => {
                        myForm.elements["contact[email]"].value = email;
                        myForm.elements["contact[tags]"].value = 'newsletter';
                        myForm.elements["utf8"].value = '✓';
                        myForm.elements["form_type"].value = 'customer';
                        myForm.submit();
                    });

                    this.isSubmitting = true;
                    // const formData = new URLSearchParams();

                    //
                    // await fetch('/contact#contact_form', {
                    //     method: 'POST',
                    //     body: formData,
                    //     headers: {
                    //         'Content-Type': 'application/x-www-form-urlencoded',
                    //         'Accept': 'application/json'
                    //     },
                    // }).then((response) => {
                    //     console.log('newsletterSubscribe', response);
                    //     if (response.ok) {
                    //         this.isSuccess = true;
                    //     } else {
                    //         response.json().then(data => {
                    //             this.serverMessage = data.errors;
                    //         });
                    //     }
                    // }).catch((error) => {
                    //     console.log('newsletterSubscribe', error);
                    //     this.serverMessage = error.message;
                    // }).then(() => {
                    //     this.isSubmitting = false;
                    // });

                } else {
                    console.log('Form is invalid');
                }
            }
        }
    }
}
