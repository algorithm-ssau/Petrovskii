document.addEventListener('DOMContentLoaded', () => {
    const previewTooltip = document.createElement('div');
    previewTooltip.className = 'preview-tooltip';
    document.body.appendChild(previewTooltip);

    let activeProject = null;
    let animationFrame = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    function isListMode() {
        return document.querySelector('.projects-grid').classList.contains('list-mode') || 
               document.querySelector('.concepts-grid').classList.contains('list-mode');
    }

    function updateTooltipPosition(e) {
        if (!isListMode() || !activeProject) {
            previewTooltip.style.opacity = '0';
            return;
        }

        if (e) {
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
        
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
            const tooltipWidth = previewTooltip.offsetWidth;
            const tooltipHeight = previewTooltip.offsetHeight;
            const posX = lastMouseX - tooltipWidth / 2;
            const posY = lastMouseY - tooltipHeight - 40;
            
            previewTooltip.style.transform = `translate(${posX}px, ${posY}px)`;
            previewTooltip.style.opacity = '1';
        });
    }

    function initPreviewHandlers() {
        const activeTab = document.querySelector('.nav-text.active').dataset.tab;
        const items = document.querySelectorAll(
            activeTab === 'projects' ? '.project-item' : '.concept-item'
        );
        
        items.forEach(item => {
            const img = item.querySelector('.preview-of-work img');
            if (!img) return;

            item.removeEventListener('mouseenter', handleMouseEnter);
            item.removeEventListener('mouseleave', handleMouseLeave);
            item.addEventListener('mouseenter', handleMouseEnter);
            item.addEventListener('mouseleave', handleMouseLeave);
        });

        function handleMouseEnter(e) {
            if (!isListMode()) return;
            activeProject = e.currentTarget;
            const img = activeProject.querySelector('.preview-of-work img');
            previewTooltip.innerHTML = `<img src="${img.src}" alt="Preview">`;
            updateTooltipPosition(e);
        }

        function handleMouseLeave() {
            activeProject = null;
            previewTooltip.style.opacity = '0';
        }
    }

    document.querySelector('.view-mode').addEventListener('click', () => {
        setTimeout(() => {
            initPreviewHandlers();
            if (!isListMode()) previewTooltip.style.opacity = '0';
        }, 100);
    });

    initPreviewHandlers();
    document.addEventListener('mousemove', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition);
});