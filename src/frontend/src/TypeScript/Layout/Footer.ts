import OpenCookies from './Footer/OpenCookies';

export default class Footer {
    private cookiesNode = <HTMLAnchorElement>document.querySelector('#open-cookies');

    constructor() {
        if (this.cookiesNode === null) {
            console.info('Open cookies button not found.');
            return;
        }

        this.cookiesNode.onclick = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            new OpenCookies();
        };
    }
}
