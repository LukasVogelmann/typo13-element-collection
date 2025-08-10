import { Swiper } from '../ContentBlocks';
import { Pagination } from '../ContentBlocks';
import { togglePagination } from '../Helper/TogglePagination';
import { setTeaserItemHeight } from '../Helper/SetTeaserItemHeight';
import '@content-block-scss/DynamicGallery.scss';

export default class DynamicGallery {
    private nodes = <NodeListOf<HTMLElement>>document.querySelectorAll('.cb-dynamicgallery');

    constructor() {
        if (!this.nodes.length) {
            return;
        }
        for (const gallery of this.nodes) {
            const fullsizedSliders = <NodeListOf<HTMLElement>>gallery.querySelectorAll('.swiper.fullsized');
            const centeredSliders = <NodeListOf<HTMLElement>>gallery.querySelectorAll('.swiper.centered');

            for (const slider of fullsizedSliders) {
                new Swiper(slider, {
                    modules: [Pagination],
                    slidesPerView: 1,
                    spaceBetween: 20,
                    loop: false,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });

                setTimeout(() => {
                    togglePagination(slider as HTMLElement);
                    setTeaserItemHeight(slider as HTMLElement);
                }, 500);

                window.addEventListener('resize', () => {
                    togglePagination(slider as HTMLElement);
                    setTeaserItemHeight(slider as HTMLElement);
                });
            }

            for (const slider of centeredSliders) {
                new Swiper(slider, {
                    modules: [Pagination],
                    slidesPerView: 2,
                    spaceBetween: 20,
                    loop: true,
                    centeredSlides: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    breakpoints: {
                        1024: {
                            slidesPerView: 3,
                            loop: false,
                            centeredSlides: false,
                        },
                    },
                });

                setTimeout(() => {
                    togglePagination(slider as HTMLElement);
                    setTeaserItemHeight(slider as HTMLElement);
                }, 500);

                window.addEventListener('resize', () => {
                    togglePagination(slider as HTMLElement);
                    setTeaserItemHeight(slider as HTMLElement);
                });
            }

            const playertype = gallery.querySelector('.media-wrapper')?.getAttribute('data-player-type');
            if (playertype === 'mp4' || playertype === 'webm') {
                const video = <HTMLVideoElement>gallery.querySelector('.media-wrapper video');
                const overlay = <HTMLElement>gallery.querySelector('.overlay');

                overlay.addEventListener('click', () => {
                    overlay.style.display = 'none';
                    video.style.filter = 'none';
                    video.attributes.setNamedItem(document.createAttribute('controls'));
                    video.play();
                });
            }

            if (playertype === 'vimeo') {
                const player = <HTMLVideoElement>gallery.querySelector('.media-wrapper .video-player');
                const overlay = <HTMLElement>gallery.querySelector('.overlay');
                const data = { method: 'play' };

                overlay.addEventListener('click', () => {
                    overlay.style.display = 'none';
                    player.style.filter = 'none';
                    player.contentWindow.postMessage(JSON.stringify(data), '*');
                });
            }
        }
    }
}
