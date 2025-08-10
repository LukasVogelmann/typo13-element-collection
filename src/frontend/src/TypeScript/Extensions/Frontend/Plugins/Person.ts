export default class ContentBlocks {
    private nodes = document.querySelectorAll('.plugin-person');

    constructor() {
        if (!this.nodes.length) {
            return;
        }

        for (const node of this.nodes) {
            this.toggleTeaserStyle(node as HTMLElement);

            window.addEventListener('resize', () => {
                this.toggleTeaserStyle(node as HTMLElement);
            });
        }
    }

    private toggleTeaserStyle(node: HTMLElement) {
        const nodeWidth = node.clientWidth;
        const windowWidth = window.innerWidth;

        if (nodeWidth <= 425 && windowWidth >= 768) {
            node.querySelector('.plugin-wrapper')?.classList.add('layout-teaser');
        } else {
            node.querySelector('.plugin-wrapper')?.classList.remove('layout-teaser');
        }
    }
}
