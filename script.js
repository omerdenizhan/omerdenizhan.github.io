document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Tarayıcı hafızasını (localStorage) kontrol et veya varsayılan olarak Koyu (dark) mod yap
    if (localStorage.getItem('theme') === 'light') {
        htmlElement.classList.remove('dark');
    } else {
        htmlElement.classList.add('dark');
    }

    // Butona tıklama olayı dinleyicisi
    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            // Koyu moddan Açık moda geçiş
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            // Açık moddan Koyu moda geçiş
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});
