document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor-view');
    const previews = document.querySelectorAll('.preview-of-work');
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isInside = false;
    const ease = 0.2;
    let lastMouseX = 0;
    let lastMouseY = 0;

    function animate() {
        if(isInside) {
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;
            cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
        requestAnimationFrame(animate);
    }
    
    animate();
    
    previews.forEach(preview => {
        preview.addEventListener('mouseenter', (e) => {
            isInside = true;
            cursor.style.opacity = '1';
            document.body.style.cursor = 'none';
            updatePosition(e);
        });
        
        preview.addEventListener('mousemove', (e) => {
            updatePosition(e);
        });
        
        preview.addEventListener('mouseleave', () => {
            isInside = false;
            cursor.style.opacity = '0';
            document.body.style.cursor = 'default';
        });
    });

    function updatePosition(e) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        targetX = lastMouseX - cursor.offsetWidth / 2;
        targetY = lastMouseY - cursor.offsetHeight / 2;
    }

    window.addEventListener('scroll', () => {
        if(isInside) {
            targetX = lastMouseX - cursor.offsetWidth / 2;
            targetY = lastMouseY - cursor.offsetHeight / 2;
        }
    }, { passive: true });
});