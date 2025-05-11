function calculateLayout() {
    const activeTab = document.querySelector('.nav-text.active')?.dataset.tab;
    if (!activeTab) return;

    const grid = document.querySelector(activeTab === 'projects' ? '.projects-grid' : '.concepts-grid');
    if (!grid || grid.classList.contains('list-mode')) return;

    const items = grid.querySelectorAll(activeTab === 'projects' ? '.project-item' : '.concept-item');
    items.forEach(item => {
        item.style.cssText = '';
        item.style.flex = '1 1 0%';
        item.style.minWidth = '';
        item.style.display = '';
    });

    const pattern = [2, 3, 4];
    const minWidth = 300;
    const visibleItems = Array.from(items).filter(item => !item.classList.contains('hiding'));
    const containerWidth = grid.offsetWidth;
    
    let currentIndex = 0;
    let patternIndex = 0;

    while (currentIndex < visibleItems.length) {
        const cols = pattern[patternIndex % pattern.length];
        const maxPossibleCols = Math.floor(containerWidth / minWidth);
        const actualCols = Math.min(cols, maxPossibleCols);
        const widthPercent = (100 / actualCols).toFixed(2);
        
        for (let i = 0; i < actualCols; i++) {
            if (currentIndex + i >= visibleItems.length) break;
            visibleItems[currentIndex + i].style.minWidth = `${widthPercent}%`;
        }
        
        currentIndex += actualCols;
        patternIndex++;
    }
}
document.querySelector('.view-mode').addEventListener('click', function(e) {
    const viewMode = this;
    if(viewMode.dataset.animating === 'true') return;
    viewMode.dataset.animating = 'true';
    
    const switcher = viewMode.querySelector('.view-switcher');
    const currentActive = switcher.querySelector('.active');
    const newView = currentActive.classList.contains('grid-view') ? 
        switcher.querySelector('.list-view') : 
        switcher.querySelector('.grid-view');
    
    switcher.style.pointerEvents = 'none';
    
    currentActive.classList.remove('active');
    newView.classList.add('active');
    
    const offset = newView.classList.contains('grid-view') ? 0 : 48;
    switcher.querySelector('.active-indicator').style.transform = `translate(${offset}px, -50%)`;
    
    const activeTab = document.querySelector('.nav-text.active').dataset.tab;
    const grid = document.querySelector(activeTab === 'projects' ? '.projects-grid' : '.concepts-grid');
    const isListMode = newView.classList.contains('list-view');
    
    grid.querySelectorAll('.project-item, .concept-item').forEach(item => {
        item.style.cssText = '';
        item.classList.toggle('list-mode-item', isListMode);
        item.querySelector('.preview-of-work').style.display = isListMode ? 'none' : 'block';
    });

    if(isListMode) {
        grid.classList.add('list-mode');
        grid.style.display = 'block';
    } else {
        grid.classList.remove('list-mode');
        grid.style.display = 'flex';
        setTimeout(() => calculateLayout(), 10);
    }
    
    setTimeout(() => {
        switcher.style.pointerEvents = 'auto';
        viewMode.dataset.animating = 'false';
    }, 100);
    calculateLayout();
});