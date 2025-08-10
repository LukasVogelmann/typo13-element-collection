import { Swiper } from '../ContentBlocks';
import { Pagination } from '../ContentBlocks';
import { togglePagination } from '../Helper/TogglePagination';
import { setTeaserItemHeight } from '../Helper/SetTeaserItemHeight';

import '@content-block-scss/Newsteaser.scss';

export default class Newsteaser {
    private node = document.querySelectorAll('.cb-newsteaser');

    constructor() {
        if (!this.node) {
            return;
        }

        for (const teaser of this.node) {
            if (teaser.classList.contains('swiper')) {
                const teaserSlideNumber = teaser.getAttribute('data-teaser-slide-number') as unknown as number;

                // initialize swiper
                new Swiper(teaser as HTMLElement, {
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
                        1024: { slidesPerView: 3 },
                        1920: { slidesPerView: teaserSlideNumber },
                    },
                });
            }

            setTimeout(() => {
                if (teaser.classList.contains('swiper')) {
                    togglePagination(teaser as HTMLElement);
                }

                setTeaserItemHeight(teaser as HTMLElement);
            }, 500);

            window.addEventListener('resize', () => {
                if (teaser.classList.contains('swiper')) {
                    togglePagination(teaser as HTMLElement);
                }
                setTeaserItemHeight(teaser as HTMLElement);
            });
        }
    }
}
