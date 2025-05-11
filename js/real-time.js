function updateTime() {
    const options = { timeZone: 'Europe/Samara', hour12: false };
    const now = new Date().toLocaleTimeString('ru-RU', options);
    document.querySelector('.time').textContent = now;
}

setInterval(updateTime, 1000);
updateTime(); 