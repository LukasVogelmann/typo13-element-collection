import '@content-block-scss/Customisation.scss';

export default class Customisation {
    private node = <HTMLElement>document.querySelector('.cb-customisation');

    constructor() {
        if (!this.node) {
            return;
        }

        const content = <NodeListOf<HTMLElement>>this.node.querySelectorAll('.content');
        const tabs = <NodeListOf<HTMLElement>>this.node.querySelectorAll('.tab');
        const dropdownWrapper = <HTMLElement>this.node.querySelector('.dropdown');
        const dropdowns = <NodeListOf<HTMLElement>>this.node.querySelectorAll('.dropdown-item');
        const navelements = [...tabs, ...dropdowns];

        for (const element of navelements) {
            const activeId = element.getAttribute('data-tab-id');

            element.addEventListener('click', () => {
                Object.values(tabs).map((tab) => {
                    tab.classList.remove('active');
                    tab.getAttribute('data-tab-id') === activeId && tab.classList.add('active');
                });

                Object.values(dropdowns).map((dropdown) => {
                    dropdown.classList.remove('active');
                    dropdown.getAttribute('data-tab-id') === activeId && dropdown.classList.add('active');
                });

                Object.values(content).map((item) => {
                    item.classList.remove('active');
                    item.getAttribute('data-tab-id') === activeId && item.classList.add('active');
                });

                const activeDropdown = <HTMLElement>dropdownWrapper.querySelector('.active');
                const dropdownSelected = <HTMLElement>dropdownWrapper.querySelector('.selected p');
                const activeText = activeDropdown.querySelector('p')?.innerHTML;

                dropdownSelected.innerHTML = activeText ?? '';
            });
        }

        for (const contentitem of content) {
            const options = <NodeListOf<HTMLElement>>contentitem.querySelectorAll('.option');
            const images = <NodeListOf<HTMLElement>>contentitem.querySelectorAll('.image-wrapper');

            for (const option of options) {
                const activeId = option.getAttribute('data-option-id');

                option.addEventListener('click', () => {
                    Object.values(options).map((_) => {
                        _.classList.remove('active');
                        _.getAttribute('data-option-id') === activeId && _.classList.add('active');
                    });

                    Object.values(images).map((_) => {
                        _.classList.remove('active');
                        _.getAttribute('data-option-id') === activeId && _.classList.add('active');
                    });
                });
            }
        }

        dropdownWrapper.addEventListener('click', () => {
            dropdownWrapper.classList.toggle('open');
        });
    }
}
