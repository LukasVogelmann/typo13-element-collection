export default class Select {
    private selects = <NodeListOf<HTMLSelectElement>>document.querySelectorAll('select');

    constructor() {
        if (this.selects.length === 0) {
            return;
        }

        for (const select of this.selects) {
            if (select.closest('div')?.classList.contains('input')) {
                select.closest('div')?.classList.add('select');
            }
        }
    }
}
