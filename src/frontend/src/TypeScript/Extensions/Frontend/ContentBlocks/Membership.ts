import { Swiper } from '../ContentBlocks';
import { Pagination } from '../ContentBlocks';
import '@content-block-scss/Membership.scss';

export default class Membership {
    private node = document.querySelectorAll('.cb-membership');

    constructor() {
        if (!this.node) {
            return;
        }

        let membershipSwiper: Swiper | null = null;
        let textHeightLargest = 0;
        let swiperActive = false;

        for (const membership of this.node) {
            const items = membership.querySelectorAll('.item');

            if (!membership.querySelector('.swiper-removed')) {
                if (window.innerWidth < 1024 && !swiperActive) {
                    initiateSwiper(membership as HTMLElement);
                    swiperActive = true;
                }

                setTimeout(() => {
                    togglePagination(membership as HTMLElement);
                }, 500);

                // resize event
                window.addEventListener('resize', () => {
                    if (window.innerWidth < 1024 && !swiperActive) {
                        initiateSwiper(membership as HTMLElement);
                    } else if (window.innerWidth >= 1024 && swiperActive) {
                        removeSwiper(membership as HTMLElement);
                    }

                    togglePagination(membership as HTMLElement);
                });
            }

            getLargestTextHeight(items);
            setTextHeight(items);

            window.addEventListener('resize', () => {
                getLargestTextHeight(items);
                console.log(textHeightLargest);
                setTextHeight(items);
            });
        }

        function getLargestTextHeight(items: NodeListOf<Element> | undefined) {
            textHeightLargest = 0;
            for (const item of items) {
                const text = item.querySelector('.text');
                if (text) {
                    text.style.height = 'unset';
                }
            }

            for (const item of items) {
                const textHeight = item.querySelector('.text')?.clientHeight;

                if (textHeight && textHeight > textHeightLargest) {
                    textHeightLargest = textHeight;
                    console.log(textHeightLargest);
                }
            }
        }

        function setTextHeight(items: NodeListOf<Element> | undefined) {
            for (const item of items) {
                const text = item.querySelector('.text');
                if (text) {
                    text.style.height = `${textHeightLargest}px`;
                }
            }
        }

        function initiateSwiper(element: HTMLElement) {
            membershipSwiper = new Swiper(element.querySelector('.swiper') as HTMLElement, {
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
                    1024: { slidesPerView: 5 },
                },
            });
            swiperActive = true;
        }

        function removeSwiper() {
            if (membershipSwiper) {
                membershipSwiper.destroy(true, true);
                swiperActive = false;
            }
        }

        function togglePagination(element: HTMLElement) {
            const pagination = element.querySelector('.swiper-pagination');
            if (!pagination) {
                return;
            }

            const bullets = pagination.querySelectorAll('.swiper-pagination-bullet');
            const count = bullets.length;

            if (count > 1) {
                pagination.classList.remove('hidden');
            } else {
                pagination.classList.add('hidden');
            }
        }
    }
}
