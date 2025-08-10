export default class Tabs {
    constructor(nodes: NodeListOf<HTMLAnchorElement>, tabContents: NodeListOf<HTMLElement>) {
        for (const node of nodes) {
            node.onclick = ({ currentTarget }: MouseEvent) => {
                const parentNode = (<HTMLElement>currentTarget).closest('.tabs') as HTMLElement;
                const { tabId } = (<HTMLElement>currentTarget).dataset;

                Object.values(nodes).map((_) => _.classList.remove('active'));
                Object.values(tabContents).map((_) => _.classList.remove('active'));

                const targetedTab = <HTMLElement>parentNode.querySelector(`.tab[data-tab-id="${tabId}"]`);
                const targetedTabContent = <HTMLElement>parentNode.querySelector(`.content[data-tab-id="${tabId}"]`);

                [targetedTab, targetedTabContent].map((_) => _.classList.add('active'));
            };
        }
    }
}
