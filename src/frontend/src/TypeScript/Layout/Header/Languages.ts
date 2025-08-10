export default class HeaderLanguages {
    private languages = <NodeListOf<HTMLElement>>document.querySelectorAll('.languages-column');

    constructor() {
        if (!this.languages.length) {
            return;
        }

        for (const language of this.languages) {
            const menu = language.querySelector('.languages-menu');
            if (!menu) {
                return;
            }

            language.onclick = () => {
                menu.classList.toggle('active');
            };

            document.body.addEventListener('click', (e: MouseEvent) => {
                if (language.contains(<Node>e.target)) {
                    return;
                }

                menu.classList.remove('active');
            });
        }
    }
}
