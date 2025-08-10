import '@content-block-scss/Accordion.scss';

export default class Accordion {
    private nodes: NodeListOf<Element>;

    constructor() {
        this.nodes = document.querySelectorAll('.cb-accordion');

        if (this.nodes.length === 0) {
            return;
        }

        this.initializeAccordion();
    }

    private initializeAccordion(): void {
        const acc = document.getElementsByClassName('accordion-title');

        for (const element of acc) {
            if (element instanceof HTMLElement) {
                element.addEventListener('click', this.handleAccordionClick.bind(this));
            }
        }
    }

    private handleAccordionClick(event: MouseEvent): void {
        const target = event.currentTarget as HTMLElement | null;

        if (!target) {
            return;
        }

        const accordionItem = target.closest('.accordion-item');
        if (accordionItem) {
            accordionItem.classList.toggle('active');
        }

        const panel = target.nextElementSibling as HTMLElement | null;
        if (panel) {
            if (panel.style.display === 'none') {
                panel.style.display = 'flex';
            } else if (panel.style.display === 'flex') {
                panel.style.display = 'none';
            }
        }
    }
}
