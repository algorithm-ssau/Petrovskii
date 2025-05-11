const vetrinaBlock = document.querySelector('.d3logo');
const maxOffsetX = 20;
const maxOffsetY = 20;

let isEventActive = false;

function handleMouseMove(e) {
  const bodyRect = document.body.getBoundingClientRect();
  const offsetX = e.clientX - bodyRect.left;
  const offsetY = e.clientY - bodyRect.top;

  let moveX = (offsetX - bodyRect.width / 2) / 10;
  let moveY = (offsetY - bodyRect.height / 2) / 10;

  moveX = Math.max(-maxOffsetX, Math.min(moveX, maxOffsetX));
  moveY = Math.max(-maxOffsetY, Math.min(moveY, maxOffsetY));

  vetrinaBlock.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

function handleMouseLeave() {
  vetrinaBlock.style.transform = 'translate(0, 0)';
}

function toggleEventListeners() {
  const shouldActivate = window.innerWidth > 768;

  if (shouldActivate && !isEventActive) {
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    isEventActive = true;
  } else if (!shouldActivate && isEventActive) {
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.body.removeEventListener('mouseleave', handleMouseLeave);
    vetrinaBlock.style.transform = 'translate(0, 0)'; // Сбросить позицию
    isEventActive = false;
  }
}

// Инициализация
toggleEventListeners();
window.addEventListener('resize', toggleEventListeners);
