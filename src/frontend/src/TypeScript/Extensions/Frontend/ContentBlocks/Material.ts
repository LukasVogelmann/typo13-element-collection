import { Splide } from '../ContentBlocks';

import '@content-block-scss/Material.scss';

export default class Material {
    constructor() {
        this.initializeSplide();
    }

    private initializeSplide(): void {
        const splideContainer = document.querySelector<HTMLDivElement>('.splide');
        if (!splideContainer) return;

        const splide = new Splide(splideContainer, {
            focus: 0,
            pagination: false,
            gap: '20px',
            arrows: false,
            perPage: 5,
            fixedWidth: '237px',
            drag: true,
            rewind: false,
            breakpoints: {
                1400: { perPage: 4, drag: true, pagination: true, padding: '8%' },
                962: { perPage: 3, drag: true, pagination: true, padding: '6%' },
                768: { perPage: 2, drag: true, pagination: true, padding: '4%' },
                576: { perPage: 1, drag: true, pagination: true, padding: '2%' },
            },
            dragMinThreshold: {
                mouse: 5,
                touch: 5,
            },
            classes: {
                pagination: 'splide__pagination splide-pagination', // container
                page: 'splide__pagination__page splide-pagination-page', // each button
            },
        });
        splide.mount();
    }
}
