export default class MobileMenuNavigation {
    private header = document.querySelector('header#layout') as HTMLElement;
    private navCol = document.querySelector('.nav-column-desktop') as HTMLElement;
    private cta = document.querySelector('.cta') as HTMLElement;
    private nav = document.querySelector('#menu-mobile') as HTMLElement;
    private megaMenu = document.querySelector('#mobile-mega-menu') as HTMLElement;
    private burgerMenu = document.querySelector('#burger-menu') as HTMLElement;
    private metaMenu = document.querySelector('.meta-row') as HTMLElement;

    constructor() {
        window.addEventListener('resize', () => {
            this.navCol.classList.remove('open');
            this.cta.classList.remove('open');
            this.header.classList.remove('open');
        });

        this.init();
    }

    private init(): void {
        const navItems = this.megaMenu.querySelectorAll('ul li a') as NodeListOf<HTMLAnchorElement>;
        const backButton = this.nav.querySelector('.back-button p') as HTMLElement;

        this.burgerMenu.addEventListener('click', () => {
            this.toggleMenu();
            this.toggleBurger();
            this.toggleScrolled();
        });

        for (const navItem of navItems) {
            navItem.closest('li')?.addEventListener('click', (event) => {
                this.handleNavItemClick(event, navItem, backButton);
            });
        }

        backButton.addEventListener('click', () => {
            this.handleBackButtonClick(backButton);
        });
    }

    private toggleMenu(): void {
        document.querySelector('body')?.classList.toggle('no-scroll');
        this.navCol.classList.toggle('open');
        this.cta.classList.toggle('open');
        this.header.classList.toggle('open');
    }

    private toggleBurger(): void {
        const icons = this.burgerMenu.querySelectorAll('svg');
        Object.values(icons).map((icon) => icon.classList.toggle('d-none'));
    }

    private toggleScrolled(): void {
        const heroHeight =
            document.querySelector('#hero')?.scrollHeight ?? document.querySelector('#subhero')?.scrollHeight ?? 0;
        const scrollY = window.scrollY;

        if (scrollY < heroHeight) {
            if (this.header.classList.contains('open')) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
    }

    private handleNavItemClick(event: Event, navItem: HTMLAnchorElement, backButton: HTMLElement): void {
        const subNav = navItem.closest('li')?.querySelector('ul') as HTMLElement | null;
        const navLevel = navItem.closest('ul')?.getAttribute('data-level-id');
        const backButtonTitle = navItem.closest('li')?.querySelector('a')?.textContent;
        const level = Number(navLevel);

        if (level <= 3 && !navItem.closest('div')?.classList.contains('overview') && subNav) {
            event.preventDefault();
            event.stopPropagation();

            if (subNav) {
                subNav.classList.toggle('open');
            }
        }

        if (!this.metaMenu.classList.contains('d-none')) {
            this.metaMenu.classList.add('d-none');
            this.megaMenu.style.height = '100%';
            backButton.closest('.back-button')?.querySelector('svg')?.classList.remove('d-none');
        }

        backButton.innerHTML = this.getBackButtonTitle(navLevel ?? null, backButtonTitle ?? null);
    }

    private handleBackButtonClick(backButton: HTMLElement): void {
        const openSubNavs = this.nav.querySelectorAll('ul.open') as NodeListOf<HTMLElement>;
        const lastOpenSubNav = openSubNavs[openSubNavs.length - 1];
        const prevNav = openSubNavs[openSubNavs.length - 2];
        const navLevel = prevNav?.getAttribute('data-level-id');

        if (lastOpenSubNav && openSubNavs.length > 1) {
            lastOpenSubNav.classList.remove('open');

            backButton.innerHTML = this.getBackButtonTitle(
                navLevel ?? null,
                prevNav?.closest('li')?.querySelector('a')?.textContent ?? null,
            );
        }
        if (openSubNavs.length === 2) {
            this.metaMenu.classList.remove('d-none');
            this.megaMenu.style.height = 'auto';
            backButton.closest('.back-button')?.querySelector('svg')?.classList.add('d-none');
        }
    }

    private getBackButtonTitle(navLevel: string | null, title: string | null): string {
        if (navLevel === '1' && title === null) {
            return 'Qualität entdecken';
        }
        if (navLevel === '1' && title !== null) {
            return 'Zur Übersicht';
        }
        return title ?? '';
    }
}
