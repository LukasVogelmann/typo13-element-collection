import { Swiper } from '../ContentBlocks';
import { Pagination } from '../ContentBlocks';
import '@content-block-scss/Gallery.scss';

export default class Gallery {
    private node = <HTMLElement>document.querySelector('.cb-gallery');

    constructor() {
        if (!this.node) {
            return;
        }
        const tabs = <NodeListOf<HTMLElement>>this.node.querySelectorAll('.tab');
        const galleries = <NodeListOf<HTMLElement>>this.node.querySelectorAll('.gallery');
        const sliders = <NodeListOf<HTMLElement>>this.node.querySelectorAll('.swiper');
        const dropdownWrapper = <HTMLElement>this.node.querySelector('.dropdown');
        const dropdowns = <NodeListOf<HTMLElement>>this.node.querySelectorAll('.dropdown-item');
        const navelements = [...tabs, ...dropdowns];

        for (const tab of navelements) {
            const activeId = tab.getAttribute('data-gallery-id');

            tab.addEventListener('click', () => {
                Object.values(tabs).map((_) => {
                    _.classList.remove('active');
                    _.getAttribute('data-gallery-id') === activeId && _.classList.add('active');
                });

                Object.values(dropdowns).map((_) => {
                    _.classList.remove('active');
                    _.getAttribute('data-gallery-id') === activeId && _.classList.add('active');
                });

                Object.values(galleries).map((_) => {
                    _.classList.remove('active');
                    _.getAttribute('data-gallery-id') === activeId && _.classList.add('active');
                });

                Object.values(sliders).map((_) => {
                    _.classList.remove('active');
                    _.getAttribute('data-gallery-id') === activeId && _.classList.add('active');
                });

                const activeDropdown = <HTMLElement>dropdownWrapper.querySelector('.active');
                const dropdownSelected = <HTMLElement>dropdownWrapper.querySelector('.selected p');
                const activeText = activeDropdown.querySelector('p')?.innerHTML;

                dropdownSelected.innerHTML = activeText ?? '';
            });
        }

        for (const slider of sliders) {
            new Swiper(slider, {
                modules: [Pagination],
                slidesPerView: 1.25,
                spaceBetween: 20,
                loop: false,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        }

        dropdownWrapper.addEventListener('click', () => {
            dropdownWrapper.classList.toggle('open');
        });
    }
}
