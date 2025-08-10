import { Swiper } from '../ContentBlocks';
import { Autoplay, FreeMode } from '../ContentBlocks';
import '@content-block-scss/Award.scss';

export default class Award {
    private node = document.querySelectorAll('.cb-award');

    constructor() {
        if (!this.node) {
            return;
        }

        for (const award of this.node) {
            let count = award.querySelectorAll('.swiper-slide').length;

            if (count <= 6) {
                count = count - 1;
            } else {
                count = 6;
            }

            new Swiper(award.querySelector('.swiper') as HTMLElement, {
                modules: [Autoplay, FreeMode],
                freeMode: true,
                loop: true,
                allowTouchMove: false,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                },
                slidesPerView: 2,
                speed: 5000,
                breakpoints: {
                    1024: { slidesPerView: 3 },
                    1920: { slidesPerView: count },
                },
            });
        }
    }
}
