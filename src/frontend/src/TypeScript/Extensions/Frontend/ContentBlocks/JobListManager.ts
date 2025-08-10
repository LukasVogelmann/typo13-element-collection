class JobListManager {
    private jobContainer: HTMLElement;
    private form: HTMLFormElement;

    constructor() {
        this.jobContainer = document.querySelector('.job-list') as HTMLElement;
        this.form = this.jobContainer?.querySelector('.job-list__form') as HTMLFormElement;

        if (!this.jobContainer) {
            return;
        }
        this.handleFilter();
        this.toggleFilter();
    }

    handleFilter() {
        this.form?.addEventListener('submit', this.submitForm);

        const filters = this.jobContainer.querySelectorAll('.filter__wrapper');

        for (const filter of filters) {
            const itemsWrapper = filter.querySelector('.filter__content');
            const deselectAll = filter.querySelector('.filter__header-icon--active');

            filter.querySelector('.filter__header')?.addEventListener('click', () => {
                if (filter.classList.contains('filter__wrapper--active')) {
                    filter.classList.remove('filter__wrapper--active');
                } else {
                    for (const otherFilter of filters) {
                        if (otherFilter.classList.contains('filter__wrapper--active')) {
                            otherFilter.classList.remove('filter__wrapper--active');
                        }
                    }

                    filter.classList.add('filter__wrapper--active');
                }

                document.onclick = (docEvent) => {
                    const target = docEvent.target as HTMLElement;
                    if (!this.form.contains(target)) {
                        this.form
                            .querySelector('.filter__wrapper--active')
                            ?.classList.remove('filter__wrapper--active');
                        document.onclick = null;
                    }
                };
            });

            const items = Array.from(
                itemsWrapper?.getElementsByClassName('filter__checkbox') as HTMLCollectionOf<HTMLInputElement>,
            );

            deselectAll?.addEventListener('click', (e) => {
                e.stopPropagation();

                for (const item of items) {
                    item.checked = false;
                }

                filter.querySelector('.filter__header')?.classList.remove('filter__header--active');
                filter.classList.remove('filter__wrapper--active');

                this.form.requestSubmit();
            });

            for (const checkbox of items) {
                checkbox.addEventListener('input', () => {
                    this.form.requestSubmit();

                    const isActive = items.some((item) => item.checked);

                    if (isActive) {
                        filter.querySelector('.filter__header')?.classList.add('filter__header--active');
                    } else {
                        filter.querySelector('.filter__header')?.classList.remove('filter__header--active');
                    }
                });
            }
        }
    }

    submitForm = async (event: Event) => {
        event.preventDefault();

        const jobsWrapper = this.jobContainer.querySelector('.job-list__results') as HTMLElement;
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = new URLSearchParams();

        formData.forEach((value, key) => {
            data.append(key, value as string);
        });

        try {
            const response = await fetch(`${form.getAttribute('action')}`, {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            jobsWrapper.innerHTML = result;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    toggleFilter() {
        const filterOpen = this.jobContainer.querySelector('.job__toggle-filter') as HTMLButtonElement;
        const filterClose = this.form.querySelector('.filter__mobile-close') as HTMLButtonElement;
        const filterApply = this.form.querySelector('.filter__mobile-apply') as HTMLButtonElement;

        filterOpen?.addEventListener('click', () => {
            document.body.classList.add('overflow-hidden');
            this.form.classList.add('filter--active');
        });

        filterClose?.addEventListener('click', () => {
            document.body.classList.remove('overflow-hidden');
            this.form.classList.remove('filter--active');
        });

        filterApply?.addEventListener('click', () => {
            document.body.classList.remove('overflow-hidden');
            this.form.classList.remove('filter--active');
        });
    }
}

export default JobListManager;
