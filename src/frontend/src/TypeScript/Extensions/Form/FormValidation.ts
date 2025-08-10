export default class FormValidation {
    private node = <HTMLElement>document.querySelector('.typo3Form');

    constructor() {
        if (!this.node) {
            return;
        }

        function validateForm(form) {
            form.noValidate = true;

            form.addEventListener('submit', (event) => {
                let isValid = true;

                for (const input of form.elements) {
                    if (input.required) {
                        let error;
                        const parentGroup = input.closest('.form-group');

                        if (input.type === 'checkbox') {
                            const parentLabel = input.closest('label.form-check-label');
                            error = parentLabel?.nextElementSibling;

                            if (!input.checked) {
                                isValid = false;

                                if (!error || !error.classList.contains('validation-error')) {
                                    error = document.createElement('span');
                                    error.className = 'validation-error';
                                    error.style.color = 'red';
                                    error.style.display = 'block';
                                    error.style.marginTop = '5px';
                                    if (input.closest('.form-group').querySelector('.errorMessage')) {
                                        error.textContent = input
                                            .closest('.form-group')
                                            .querySelector('.errorMessage').textContent;
                                    } else {
                                        // @ts-ignore
                                        error.textContent = window.TYPO3.lang.formCheckboxRequired;
                                    }
                                    parentLabel.insertAdjacentElement('afterend', error);
                                }
                                parentGroup && parentGroup.classList.add('error-present');
                            } else if (error && error.classList.contains('validation-error')) {
                                error.remove();
                                parentGroup && parentGroup.classList.remove('error-present');
                            }
                        } else if (input.type === 'email') {
                            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                            error = input.nextElementSibling;

                            if (!input.value.trim()) {
                                isValid = false;

                                if (!error || !error.classList.contains('validation-error')) {
                                    error = document.createElement('span');
                                    error.className = 'validation-error';
                                    error.style.color = 'red';
                                    if (input.closest('.form-group').querySelector('.errorMessage')) {
                                        error.textContent = input
                                            .closest('.form-group')
                                            .querySelector('.errorMessage').textContent;
                                    } else {
                                        // @ts-ignore
                                        error.textContent = window.TYPO3.lang.formRequired;
                                    }
                                    input.insertAdjacentElement('afterend', error);
                                }
                                parentGroup && parentGroup.classList.add('error-present');
                            } else if (!emailRegex.test(input.value.trim())) {
                                isValid = false;

                                if (!error || !error.classList.contains('validation-error')) {
                                    error = document.createElement('span');
                                    error.className = 'validation-error';
                                    error.style.color = 'red';
                                    if (input.closest('.form-group').querySelector('.errorMessage')) {
                                        error.textContent = input
                                            .closest('.form-group')
                                            .querySelector('.errorMessage').textContent;
                                    } else {
                                        // @ts-ignore
                                        error.textContent = window.TYPO3.lang.formEmailInvalid;
                                    }
                                    input.insertAdjacentElement('afterend', error);
                                }
                                parentGroup && parentGroup.classList.add('error-present');
                            } else if (error && error.classList.contains('validation-error')) {
                                error.remove();
                                parentGroup && parentGroup.classList.remove('error-present');
                            }
                        } else if (input.type === 'tel') {
                            const telRegex =
                                /^(?=.{1,17}$)\+?[0-9]{1,4}?[.\-\s]?\(?\d{1,4}\)?[.\-\s]?\d{3,}[.\-\s]?\d{1,4}$/;

                            error = input.nextElementSibling;

                            if (!input.value.trim()) {
                                isValid = false;

                                if (!error || !error.classList.contains('validation-error')) {
                                    error = document.createElement('span');
                                    error.className = 'validation-error';
                                    error.style.color = 'red';
                                    if (input.closest('.form-group').querySelector('.errorMessage')) {
                                        error.textContent = input
                                            .closest('.form-group')
                                            .querySelector('.errorMessage').textContent;
                                    } else {
                                        // @ts-ignore
                                        error.textContent = window.TYPO3.lang.formRequired;
                                    }
                                    input.insertAdjacentElement('afterend', error);
                                }
                                parentGroup && parentGroup.classList.add('error-present');
                            } else if (!telRegex.test(input.value.trim())) {
                                isValid = false;

                                if (!error || !error.classList.contains('validation-error')) {
                                    error = document.createElement('span');
                                    error.className = 'validation-error';
                                    error.style.color = 'red';
                                    if (input.closest('.form-group').querySelector('.errorMessage')) {
                                        error.textContent = input
                                            .closest('.form-group')
                                            .querySelector('.errorMessage').textContent;
                                    } else {
                                        // @ts-ignore
                                        error.textContent = window.TYPO3.lang.formPhoneInvalid;
                                    }
                                    input.insertAdjacentElement('afterend', error);
                                }
                                parentGroup && parentGroup.classList.add('error-present');
                            } else if (error && error.classList.contains('validation-error')) {
                                error.remove();
                                parentGroup && parentGroup.classList.remove('error-present');
                            }
                        } else {
                            error = input.nextElementSibling;

                            if (!input.value.trim()) {
                                isValid = false;

                                if (!error || !error.classList.contains('validation-error')) {
                                    error = document.createElement('span');
                                    error.className = 'validation-error';
                                    error.style.color = 'red';
                                    if (input.closest('.form-group').querySelector('.errorMessage')) {
                                        error.textContent = input
                                            .closest('.form-group')
                                            .querySelector('.errorMessage').textContent;
                                    } else {
                                        // @ts-ignore
                                        error.textContent = window.TYPO3.lang.formRequired;
                                    }
                                    input.insertAdjacentElement('afterend', error);
                                }
                                parentGroup && parentGroup.classList.add('error-present');
                            } else if (error && error.classList.contains('validation-error')) {
                                error.remove();
                                parentGroup && parentGroup.classList.remove('error-present');
                            }
                        }
                    }
                }

                if (!isValid) {
                    const firstInvalidField = form.querySelector('.validation-error');
                    firstInvalidField?.previousElementSibling?.focus();
                    event.preventDefault();
                }
            });

            form.addEventListener('change', (event) => {
                const input = event.target;

                if (input.type === 'checkbox' && input.required) {
                    const parentLabel = input.closest('label.form-check-label');
                    const error = parentLabel?.nextElementSibling;

                    if (input.checked && error && error.classList.contains('validation-error')) {
                        error.remove();
                        const parentGroup = input.closest('.form-group');
                        parentGroup && parentGroup.classList.remove('error-present');
                    }
                } else if (input.required) {
                    const error = input.nextElementSibling;

                    if (input.value.trim() && error && error.classList.contains('validation-error')) {
                        error.remove();
                        const parentGroup = input.closest('.form-group');
                        parentGroup && parentGroup.classList.remove('error-present');
                    }
                }
            });
        }

        validateForm(this.node);
    }
}
