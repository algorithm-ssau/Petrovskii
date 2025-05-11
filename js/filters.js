document.addEventListener('DOMContentLoaded', function() {
    // ========== DOM ЭЛЕМЕНТЫ ==========
    const filtersButton = document.querySelector('.filters-button');
    const filterPlus = document.querySelector('.filter-button-plus');
    const filtersBlock = document.querySelector('.Filters');
    const filterTypes = document.querySelectorAll('.Filter-types');
    const filterGroups = document.querySelectorAll('.filter-group');
    const filterApplied = document.querySelector('.filter-applied');
    const tabs = document.querySelectorAll('.nav-text');
    const underline = document.querySelector('.underline');

    // ========== СОСТОЯНИЕ ==========
    const filtersData = {
        design: { count: 0, items: [] },
        development: { count: 0, items: [] },
        branding: { count: 0, items: [] },
        review: { count: 0, items: [] },
        etc: { count: 0, items: [] }
    };
    
    let isFiltersVisible = false;

    // ========== ОСНОВНЫЕ ФУНКЦИИ ==========
    function animateValue(element, start, end, duration = 400) {
        if (start === end) return;
    
        element.classList.add('updating');
        const range = end - start;
        const startTime = Date.now();
        const easeOutQuad = t => t * (2 - t);
    
        const getRussianFilterText = (count) => {
            const mod10 = count % 10;
            const mod100 = count % 100;
            let word = 'фильтров';
    
            if (mod10 === 1 && mod100 !== 11) {
                word = 'фильтр';
            } else if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
                word = 'фильтра';
            }
    
            const activeWord = (count === 1) ? 'активен' : 'активно';
    
            return `${count} ${word} ${activeWord}`;
        };
    
        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + range * easeOutQuad(progress));
    
            element.textContent = element.classList.contains('filter-applied') 
                ? getRussianFilterText(current)
                : current;
    
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.classList.remove('updating');
            }
        };
    
        requestAnimationFrame(update);
    }
    function resetFilters() {
        Object.keys(filtersData).forEach(key => {
            filtersData[key] = { count: 0, items: [] };
        });

        document.querySelectorAll('.filter-item.active').forEach(item => {
            item.classList.remove('active');
        });

        filterGroups.forEach(group => {
            group.style.opacity = '0';
            group.classList.remove('active');
        });
        
        const defaultGroup = document.querySelector('.filter-group[data-type="design"]');
        defaultGroup.classList.add('active');
        setTimeout(() => defaultGroup.style.opacity = '1', 10);

        document.querySelectorAll('.Filter-types').forEach(t => t.classList.remove('active'));
        document.querySelector('.Filter-types[data-type="design"]').classList.add('active');
        
        filterApplied.textContent = '0 фильтров активно';
    }

    function updateFiltersPosition() {
        const activeTab = document.querySelector('.nav-text.active').dataset.tab;
        const activeGrid = document.querySelector(
            activeTab === 'projects' ? '.projects-grid' : '.concepts-grid'
        );
        
        activeGrid.style.marginTop = isFiltersVisible 
            ? `${filtersBlock.offsetHeight + 20}px`
            : '0';
    }

    function toggleFiltersAnimation(withAnimation) {
        if (withAnimation) {
            filtersBlock.style.transition = 'all 0.3s ease';
            filtersBlock.classList.toggle('visible');
        } else {
            filtersBlock.style.transition = 'none';
            filtersBlock.classList.toggle('visible', isFiltersVisible);
            setTimeout(() => filtersBlock.style.transition = '', 10);
        }
        updateFiltersPosition();
    }

    function updateProjectCount() {
        const projectsCount = document.querySelectorAll('.project-item').length;
        const conceptsCount = document.querySelectorAll('.concept-item').length;
        const activeTab = document.querySelector('.nav-text.active').dataset.tab;
        
        document.querySelectorAll('.all-projects-number').forEach(el => {
            animateValue(el, +el.textContent || 0, projectsCount);
        });
        document.querySelectorAll('.all-concepts-number').forEach(el => {
            animateValue(el, +el.textContent || 0, conceptsCount);
        });

        const headerTitle = document.querySelector('.header-title');
        const activeCount = activeTab === 'projects' ? projectsCount : conceptsCount;
        
        document.querySelectorAll('.header-title-count').forEach(el => {
            animateValue(el, +el.textContent || 0, activeCount);
        });
    
        headerTitle.firstChild.textContent = 
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' ';
    
        const visibleElements = document.querySelectorAll(
            `${activeTab === 'projects' ? '.project-item' : '.concept-item'}:not(.hiding)`
        );
        document.querySelectorAll('.number-of-filtered').forEach(el => {
            animateValue(el, +el.textContent || 0, visibleElements.length);
        });
    }

    function applyFilters() {
        const activeTab = document.querySelector('.nav-text.active').dataset.tab;
        const grid = document.querySelector(activeTab === 'projects' ? '.projects-grid' : '.concepts-grid');
        const items = grid.querySelectorAll(activeTab === 'projects' ? '.project-item' : '.concept-item');

        const activeFilters = new Set();
        Object.values(filtersData).forEach(group => {
            group.items.forEach(item => activeFilters.add(item.toLowerCase()));
        });

        items.forEach(item => {
            const tags = new Set(
                item.dataset.tags.toLowerCase().split(',').map(t => t.trim())
            );
            const category = item.dataset.category.toLowerCase();
            
            const shouldShow = Array.from(activeFilters).every(f => 
                tags.has(f) || category === f
            );

            item.classList.toggle('hiding', !shouldShow);
            item.style.display = shouldShow ? '' : 'none';
        });

        updateProjectCount();
        calculateLayout();
    }

    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
    if (filtersButton) {
        filtersButton.addEventListener('click', function() {
            isFiltersVisible = !isFiltersVisible;
            if(isFiltersVisible) {
                filterPlus.style.transform = 'rotate(-30deg)';
                setTimeout(() => {
                    filterPlus.style.transform = 'rotate(45deg)';
                }, 50);
            } else {
                filterPlus.style.transform = 'rotate(75deg)';
                setTimeout(() => {
                    filterPlus.style.transform = 'rotate(0deg)';
                }, 50);
            }
    
            toggleFiltersAnimation(true);
            
            
            
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            const wasVisible = isFiltersVisible;
            resetFilters();
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.projects-grid, .concepts-grid').forEach(grid => {
                grid.style.display = 'none';
                grid.classList.remove('list-mode');
                grid.querySelectorAll('.project-item, .concept-item').forEach(item => {
                    item.classList.remove('list-mode-item');
                    item.style.cssText = '';
                    item.querySelector('.preview-of-work').style.display = 'block';
                });
            });
    
            const activeTab = this.dataset.tab;
            const activeGrid = document.querySelector(
                activeTab === 'projects' ? '.projects-grid' : '.concepts-grid'
            );
            activeGrid.style.display = 'flex';
            
            document.querySelector('.view-switcher .list-view').classList.remove('active');
            document.querySelector('.view-switcher .grid-view').classList.add('active');
            document.querySelector('.active-indicator').style.transform = 'translate(0, -50%)';
            underline.style.width = `${this.offsetWidth}px`;
            underline.style.left = `${this.offsetLeft}px`;
    

            setTimeout(() => {
                calculateLayout();
                updateFiltersPosition();
            }, 10);
            
            isFiltersVisible = wasVisible;
            toggleFiltersAnimation(false);
            applyFilters();
        });
    });

    filterTypes.forEach(type => {
        type.addEventListener('click', function() {
            if (this.classList.contains('active')) return;

            const filterType = this.dataset.type;
            filterGroups.forEach(group => {
                group.style.opacity = '0';
                group.classList.remove('active');
            });

            setTimeout(() => {
                const activeGroup = document.querySelector(`.filter-group[data-type="${filterType}"]`);
                activeGroup.classList.add('active');
                activeGroup.style.opacity = '1';
            }, 300);

            filterTypes.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', function() {
            const parentType = this.closest('.filter-group').dataset.type;
            this.classList.toggle('active');
    
            const filterText = this.textContent.trim().toLowerCase();
            const isActive = this.classList.contains('active');
    
            filtersData[parentType].count += isActive ? 1 : -1;
            filtersData[parentType].items = isActive 
                ? [...filtersData[parentType].items, filterText] 
                : filtersData[parentType].items.filter(i => i !== filterText);
    
            const total = Object.values(filtersData).reduce((sum, { count }) => sum + count, 0);
    
            const mod10 = total % 10;
            const mod100 = total % 100;
    
            let word = 'фильтров';
            if (mod10 === 1 && mod100 !== 11) {
                word = 'фильтр';
            } else if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
                word = 'фильтра';
            }
    
            const activeWord = (total === 1) ? 'активен' : 'активно';
    
            filterApplied.textContent = `${total} ${word} ${activeWord}`;
    
            applyFilters();
        });
    });

    // ========== ИНИЦИАЛИЗАЦИЯ ==========

    
    function init() {
        const activeTab = document.querySelector('.nav-text.active');
        underline.style.width = `${activeTab.offsetWidth}px`;
        underline.style.left = `${activeTab.offsetLeft}px`;
        underline.style.opacity = '1'; 
        document.querySelector('.filter-group[data-type="design"]').classList.add('active');
        document.querySelector('.Filter-types[data-type="design"]').classList.add('active');
        updateProjectCount();
        applyFilters();
        window.addEventListener('resize', () => {
            calculateLayout();
            updateFiltersPosition();
        });
    }

    init();
});