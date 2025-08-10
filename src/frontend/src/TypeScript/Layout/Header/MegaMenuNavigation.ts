import Tabs from '../../Components/Tabs';

export default class MegaMenuNavigation {
    private header = <HTMLElement>document.querySelector('header#layout');
    private nav = <HTMLElement>document.querySelector('#menu-desktop');
    private megaMenu = <HTMLElement>document.querySelector('#mega-menu');
    private backdrop = <HTMLElement>document.querySelector('#mega-menu-backdrop');

    constructor() {
        window.addEventListener('resize', () => {
            [this.nav, this.megaMenu, this.header].map(
                (_) => _.classList.contains('active') && _.classList.remove('active'),
            );
        });

        new Tabs(
            <NodeListOf<HTMLAnchorElement>>this.megaMenu.querySelectorAll('.item .tabs .top .tab'),
            <NodeListOf<HTMLElement>>this.megaMenu.querySelectorAll('.item .tabs .bottom .content'),
        );

        this.backdrop.onclick = () => {
            [this.nav, this.megaMenu, this.header].map(
                (_) => _.classList.contains('active') && _.classList.remove('active'),
            );
        };

        const nodes = <NodeListOf<HTMLAnchorElement>>this.nav.querySelectorAll('ul li > a[data-page-id]');
        for (const node of nodes) {
            node.addEventListener('click', (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                [this.nav, this.megaMenu, this.header].map(
                    (_) => _.classList.contains('active') || _.classList.add('active'),
                );

                const { pageId } = node.dataset;
                Object.values(this.megaMenu.querySelectorAll('.item.active')).map((_) => _.classList.remove('active'));
                (<HTMLElement>this.megaMenu.querySelector(`.item[data-page-id="${pageId}"]`)).classList.add('active');
            });

            node.onmouseenter = ({ currentTarget }: MouseEvent) => {
                [this.nav, this.megaMenu, this.header].map(
                    (_) => _.classList.contains('active') || _.classList.add('active'),
                );

                const { pageId } = (<HTMLElement>currentTarget).dataset;
                Object.values(this.megaMenu.querySelectorAll('.item.active')).map((_) => _.classList.remove('active'));
                (<HTMLElement>this.megaMenu.querySelector(`.item[data-page-id="${pageId}"]`)).classList.add('active');
            };

            this.backdrop.onmouseenter = () => {
                this.header.classList.remove('active');
                this.megaMenu.classList.remove('active');
            };
        }
    }
}
