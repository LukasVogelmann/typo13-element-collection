import { Splide } from '../ContentBlocks';
import '@content-block-scss/ProfileDisplayer.scss';

const SELECTORS = {
    profileDisplayer: '.cb-profiledisplayer',
    previousArrow: '#previous-arrow',
    nextArrow: '#next-arrow',
    paginationContainer: '.pagination-container',
    contentArea: '.content-area .content',
    paginationButton: '.pagination-button',
    currentSlide: '#current-slide',
};

const CLASSES = {
    active: 'active',
    paginationButton: 'pagination-button',
};

const EVENTS = {
    moved: 'moved',
};

export default class ProfileDisplayer {
    private profiles: NodeListOf<HTMLElement>;

    constructor() {
        this.profiles = document.querySelectorAll<HTMLElement>(SELECTORS.profileDisplayer);

        if (this.profiles.length === 0) {
            console.warn('No profile displayers found.');
            return;
        }

        this.profiles.forEach((profile) => this.initializeProfile(profile));
    }

    // Initialize Splide and related handlers for each profile
    private initializeProfile(profile: HTMLElement): void {
        const splide = new Splide(profile, this.getSplideOptions());
        splide.mount();

        this.initializeContent(profile);
        this.setupHandlers(profile, splide);
    }

    // Define Splide options for responsive behavior
    private getSplideOptions() {
        return {
            trimSpace: false,
            focus: 0,
            updateOnMove: true,
            pagination: false,
            gap: '20px',
            arrows: false,
            perPage: 4,
            autoplay: false,
            breakpoints: {
                400: { perPage: 1.5, padding: '0%' },
                576: { perPage: 2, padding: '0%' },
                768: { perPage: 2.5 },
                992: { perPage: 3 },
                1280: { perPage: 3 },
                1440: { perPage: 3.5 },
                1680: { perPage: 3.5 },
            },
            dragMinThreshold: { mouse: 5, touch: 5 },
        };
    }

    // Set up all event handlers
    private setupHandlers(profile: HTMLElement, splide: Splide): void {
        this.setupSlideClickHandler(profile, splide);
        this.setupNavigation(profile, splide);
        this.setupPagination(profile, splide);
        this.setupSlideChangeHandler(profile, splide);
    }

    private setupSlideClickHandler(profile: HTMLElement, splide: Splide): void {
        profile.addEventListener('click', (event) => {
            const target = (event.target as HTMLElement)?.closest('.splide__slide');
            if (target) {
                const slideIndex = [...target.parentElement!.children].indexOf(target);
                splide.go(slideIndex);
            }
        });
    }

    private setupNavigation(profile: HTMLElement, splide: Splide): void {
        const nextArrow = profile.querySelector<HTMLElement>(SELECTORS.nextArrow);
        nextArrow?.addEventListener('click', () => splide.go('>'));
        const previousArrow = profile.querySelector<HTMLElement>(SELECTORS.previousArrow);
        previousArrow?.addEventListener('click', () => splide.go('<'));
    }

    private setupPagination(profile: HTMLElement, splide: Splide): void {
        const paginationContainer = profile.querySelector<HTMLElement>(SELECTORS.paginationContainer);
        if (!paginationContainer) return;

        const totalSlides = splide.length;

        for (let i = 0; i < totalSlides; i++) {
            const button = document.createElement('button');
            button.classList.add(CLASSES.paginationButton);
            button.dataset.index = i.toString();
            button.setAttribute('aria-label', `Go to slide ${i + 1}`);
            button.setAttribute('role', 'tab');
            button.addEventListener('click', () => splide.go(i));
            paginationContainer.appendChild(button);
        }

        this.updatePaginationButtons(paginationContainer, 0);
    }

    private setupSlideChangeHandler(profile: HTMLElement, splide: Splide): void {
        const contents = profile.querySelectorAll<HTMLElement>(SELECTORS.contentArea);
        const paginationContainer = profile.querySelector<HTMLElement>(SELECTORS.paginationContainer);
        const currentSlideElement = profile.querySelector<HTMLElement>(SELECTORS.currentSlide);
        const previousArrow = profile.querySelector<HTMLElement>('#previous-arrow');

        splide.on(EVENTS.moved, (newIndex: number) => {
            this.updateContentVisibility(contents, newIndex);
            this.updatePaginationButtons(paginationContainer, newIndex);
            if (currentSlideElement) currentSlideElement.textContent = (newIndex + 1).toString();
            if (previousArrow) {
                if (newIndex >= 1) {
                    previousArrow.style.display = 'inline-block';
                } else {
                    previousArrow.style.display = 'none';
                }
            }
        });
    }

    private initializeContent(profile: HTMLElement): void {
        const contents = profile.querySelectorAll<HTMLElement>(SELECTORS.contentArea);
        this.updateContentVisibility(contents, 0);
    }

    private updateContentVisibility(contents: NodeListOf<HTMLElement>, activeIndex: number): void {
        contents.forEach((content, index) => {
            content.classList.toggle(CLASSES.active, index === activeIndex);
        });
    }

    private updatePaginationButtons(paginationContainer: HTMLElement | null, activeIndex: number): void {
        if (!paginationContainer) return;

        const buttons = paginationContainer.querySelectorAll<HTMLElement>(SELECTORS.paginationButton);
        buttons.forEach((button, index) => {
            const isActive = index === activeIndex;
            button.classList.toggle(CLASSES.active, isActive);
            button.setAttribute('aria-selected', isActive.toString());
        });
    }
}
