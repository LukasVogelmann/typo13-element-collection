import { Swiper } from '../ContentBlocks';
import { Pagination } from '../ContentBlocks';
import { togglePagination } from '../Helper/TogglePagination';
import { setTeaserItemHeight } from '../Helper/SetTeaserItemHeight';
import '@content-block-scss/Producttype.scss';

export default class Producttype {
    private node = document.querySelectorAll('.cb-producttype');

    constructor() {
        if (!this.node) {
            return;
        }

        for (const item of this.node) {
            // initialize swiper
            new Swiper(item as HTMLElement, {
                modules: [Pagination],
                slidesPerView: 1.25,
                spaceBetween: 20,
                loop: false,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    576: { slidesPerView: 2.25 },
                    1024: { slidesPerView: 3.25 },
                    1920: { slidesPerView: 4 },
                },
            });

            setTimeout(() => {
                togglePagination(item as HTMLElement);
                setTeaserItemHeight(item as HTMLElement);
            }, 500);

            // resize event
            window.addEventListener('resize', () => {
                togglePagination(item as HTMLElement);
                setTeaserItemHeight(item as HTMLElement);
            });
        }
    }
}
