export function togglePagination(element: HTMLElement) {
    const pagination = element.querySelector('.swiper-pagination');
    if (!pagination) {
        return;
    }

    const bullets = pagination.querySelectorAll('.swiper-pagination-bullet');
    const count = bullets.length;

    if (count > 1) {
        pagination.classList.remove('hidden');
    } else {
        pagination.classList.add('hidden');
    }
}
