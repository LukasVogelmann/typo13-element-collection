export function setTeaserItemHeight(element: HTMLElement) {
    let newHeight = 0;

    for (const item of element.querySelectorAll('.item')) {
        (item as HTMLElement).style.height = 'unset';
    }

    for (const item of element.querySelectorAll('.item')) {
        const teaserHeight = (item as HTMLElement).offsetHeight;
        if (teaserHeight > newHeight) {
            newHeight = teaserHeight;
        }
    }

    for (const item of element.querySelectorAll('.item')) {
        (item as HTMLElement).style.height = `${newHeight}px`;
    }
}
