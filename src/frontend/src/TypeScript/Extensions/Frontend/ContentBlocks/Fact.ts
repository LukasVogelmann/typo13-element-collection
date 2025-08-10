import '@content-block-scss/Fact.scss';

export default class Fact {
    private node: HTMLElement | null = document.querySelector('.cb-fact');

    constructor() {
        if (this.node) {
            this.onElementInViewport(this.node.querySelector('.facts-wrapper') as HTMLElement, this.animateCount);
        }
    }

    private animateCount = () => {
        const items = this.node?.querySelectorAll<HTMLElement>('.item .number');
        if (!items) return;

        for (const item of items) {
            const value = Number(item.getAttribute('data-value') || 0);
            const duration = 2500;
            const step = Math.ceil(value / 100);
            let counter = 0;

            const formatter = new Intl.NumberFormat('de-DE');
            const interval = setInterval(() => {
                counter = Math.min(counter + step, value);
                item.textContent = formatter.format(counter);

                if (counter >= value) {
                    clearInterval(interval);
                }
            }, duration / 100);
        }
    };

    private onElementInViewport(element: HTMLElement, callback: () => void) {
        const scrollHandler = () => {
            const { top, height } = element.getBoundingClientRect();
            const { innerHeight } = window;

            const elementCenter = top + height / 2;

            if (elementCenter >= 0 && elementCenter <= innerHeight) {
                callback();
                window.removeEventListener('scroll', scrollHandler);
            }
        };

        window.addEventListener('scroll', scrollHandler);
    }
}
