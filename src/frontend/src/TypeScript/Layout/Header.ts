import HeaderLanguages from './Header/Languages';
import MobileMenuNavigation from './Header/MegaMenuNavigation';
import MegaMenuNavigation from './Header/MobileMenuNavigation';

export default class Header {
    private hero = <HTMLElement>document.querySelector('#hero');
    private logo = <HTMLImageElement>document.querySelector('#logo');
    private negativeLogo = <HTMLImageElement>document.querySelector('#negative-logo');

    constructor() {
        this.heroHeaderLayout();

        new HeaderLanguages();
        new MobileMenuNavigation();
        new MegaMenuNavigation();
    }

    private heroHeaderLayout() {
        if (this.hero === null) {
            console.info('Logo switch disabled - Hero record not found.');
        }

        window.addEventListener('scroll', () => {
            if (this.hero === null) {
                return;
            }

            const heroHeight = this.hero.offsetHeight;
            const heroBottom = this.hero.getBoundingClientRect().bottom;

            const progress = Math.min(Math.max(heroBottom / (heroHeight / 2), 0), 1);
            const maskPosition = 100 - progress * 100;

            this.logo.setAttribute(
                'style',
                `clip-path: inset(0 0 ${1 - maskPosition}% 0);
                opacity: ${1 - progress};`.trim(),
            );
            this.negativeLogo.setAttribute(
                'style',
                `clip-path: inset(0 0 ${maskPosition}% 0);
                opacity: ${progress};`.trim(),
            );
        });

        window.addEventListener('scroll', () => {
            const header = document.getElementById('layout');
            const heroHeight = this.hero?.scrollHeight ?? 0;
            const scrollY = window.scrollY;

            if (scrollY > heroHeight - (heroHeight > 0 ? (header?.scrollHeight ?? 0) : 0)) {
                header?.classList.contains('scrolled') || header?.classList.add('scrolled');
            } else {
                header?.classList.contains('scrolled') && header?.classList.remove('scrolled');
            }
        });
    }
}
