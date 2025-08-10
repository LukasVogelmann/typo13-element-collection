import { Swiper } from '../ContentBlocks';
import { Navigation, Pagination, Autoplay } from '../ContentBlocks';
import '@content-block-scss/Hero.scss';

export default class Hero {
    private node = <HTMLElement>document.querySelector('#hero');
    private arrow = <HTMLElement>this.node?.querySelector('.arrow-down');

    constructor() {
        if (!this.node) {
            return;
        }

        const autoplay = this.node.classList.contains('autoplay');

        if (autoplay) {
            new Swiper(this.node, {
                modules: [Navigation, Pagination, Autoplay],
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        } else {
            new Swiper(this.node, {
                modules: [Navigation, Pagination],
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        }

        if (this.arrow) {
            this.arrow.addEventListener('click', this.scrollDownByViewportHeight);
        }
    }
    private scrollDownByViewportHeight = (event: Event) => {
        event.preventDefault();
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth',
        });
    };
}
