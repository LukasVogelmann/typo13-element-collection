import { Swiper } from '../ContentBlocks';
import { Pagination } from '../ContentBlocks';
import { togglePagination } from '../Helper/TogglePagination';
import { setTeaserItemHeight } from '../Helper/SetTeaserItemHeight';
import '@content-block-scss/Process.scss';

export default class Process {
    private node = document.querySelectorAll('.cb-process');

    constructor() {
        if (!this.node) {
            return;
        }

        for (const process of this.node) {
            new Swiper(process as HTMLElement, {
                modules: [Pagination],
                slidesPerView: 1.25,
                spaceBetween: 15,
                loop: false,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    576: { slidesPerView: 2.25 },
                    1024: { slidesPerView: 3.25 },
                    1920: { slidesPerView: 5 },
                },
            });

            setTimeout(() => {
                togglePagination(process as HTMLElement);
                setTeaserItemHeight(process as HTMLElement);
            }, 500);

            // resize event
            window.addEventListener('resize', () => {
                togglePagination(process as HTMLElement);
                setTeaserItemHeight(process as HTMLElement);
            });
        }
    }
}
