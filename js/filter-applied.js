document.addEventListener('DOMContentLoaded', function () {
    const projectsLink = document.querySelector('[data-tab="projects"]');
    const filtersButton = document.querySelector('.filters-button');
    const filterApplied = document.querySelector('.filter-applied');
    const headerRight = document.querySelector('.header-right');

    function updateFilterPosition() {
        if (window.innerWidth < 768) {
            filterApplied.style.left = '';
            filterApplied.style.top = '';
            return;
        }

        if (projectsLink && filtersButton && filterApplied && headerRight) {
            const projectsRect = projectsLink.getBoundingClientRect();
            const filtersRect = filtersButton.getBoundingClientRect();
            const headerRightRect = headerRight.getBoundingClientRect();

            const leftPosition = projectsRect.left - headerRightRect.left;
            const topPosition = filtersRect.bottom - headerRightRect.top;

            filterApplied.style.left = `${leftPosition}px`;
            filterApplied.style.top = `${topPosition}px`;
        }
    }

    updateFilterPosition();

    window.addEventListener('resize', updateFilterPosition);
    window.addEventListener('orientationchange', updateFilterPosition);
});
