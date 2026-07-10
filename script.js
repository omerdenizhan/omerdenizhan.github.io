document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeBtn');
    
    // Tıklama olayını dinle
    themeBtn.addEventListener('click', () => {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            body.setAttribute('data-theme', 'light');
            themeBtn.innerHTML = '☀️ Açık Mod';
        } else {
            body.setAttribute('data-theme', 'dark');
            themeBtn.innerHTML = '🌙 Koyu Mod';
        }
    });
});
