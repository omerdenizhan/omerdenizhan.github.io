const translations = {
    tr: {
        title: "Yapım Aşamasında!",
        desc: "Web sitemiz şu anda sizler için yenilenmektedir. Çok daha güzel ve işlevsel bir deneyimle pek yakında yayındayız.",
        footer: "2026 Lisansızdır | Ömer Denizhan",
        nextLang: "EN"
    },
    en: {
        title: "Under Construction!",
        desc: "Our website is currently undergoing maintenance to bring you a better experience. We will be live very soon.",
        footer: "2026 Unlicensed | Ömer Denizhan",
        nextLang: "TR"
    }
};

let currentLang = localStorage.getItem('site_lang') || 'tr';
let currentTheme = localStorage.getItem('site_theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
}

function initUI() {
    // Sol Üst: GitHub Butonu (FontAwesome)
    const topLeftDiv = document.createElement('div');
    topLeftDiv.className = 'top-left';
    topLeftDiv.innerHTML = `
        <a href="https://github.com/omerdenizhan" target="_blank" class="top-btn" title="GitHub">
            <i class="fab fa-github"></i>
        </a>
    `;
    document.body.appendChild(topLeftDiv);

    // Sağ Üst Kapsayıcı
    const topRightDiv = document.createElement('div');
    topRightDiv.className = 'top-right';

    // Dil Değiştirme Butonu
    const langBtn = document.createElement('button');
    langBtn.className = 'top-btn';
    langBtn.id = 'lang-btn';
    langBtn.title = 'Dil Değiştir / Change Language';
    langBtn.textContent = translations[currentLang].nextLang;
    langBtn.addEventListener('click', toggleLanguage);

    // Açık / Koyu Mod Butonu (FontAwesome)
    const themeBtn = document.createElement('button');
    themeBtn.className = 'top-btn';
    themeBtn.id = 'theme-btn';
    themeBtn.title = 'Tema Değiştir / Toggle Theme';
    themeBtn.innerHTML = currentTheme === 'dark' 
        ? `<i class="fas fa-sun"></i>`
        : `<i class="fas fa-moon"></i>`;
    themeBtn.addEventListener('click', toggleTheme);
    topRightDiv.appendChild(langBtn);
    topRightDiv.appendChild(themeBtn);
    document.body.appendChild(topRightDiv);

    // Merkez Bakım Kartı
    const card = document.createElement('div');
    card.className = 'maintenance-card';
    card.id = 'main-card';
    updateCardContent(card);
    document.body.insertBefore(card, document.querySelector('footer'));
}

function updateCardContent(cardElement) {
    const t = translations[currentLang];
    cardElement.innerHTML = `
        <div class="image-container">
            <i class="fas fa-person-digging"></i>
        </div>
        <h1>${t.title}</h1>
        <p>${t.desc}</p>
    `;
}

function toggleLanguage() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('site_lang', currentLang);
    // Dil değiştiğinde daktilo indeksini sıfırlıyoruz ki yeni dilden baştan yazmaya başlasın
    index = 0;
    const langBtn = document.getElementById('lang-btn');
    langBtn.style.transform = 'rotate(360deg) scale(1.1)';
    setTimeout(() => {
        langBtn.textContent = translations[currentLang].nextLang;
        langBtn.style.transform = 'none';
    }, 200);

    const card = document.getElementById('main-card');
    if (card) {
        card.style.opacity = '0';
        setTimeout(() => {
            updateCardContent(card);
            card.style.opacity = '1';
        }, 200);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('site_theme', currentTheme);
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.style.transform = 'rotate(360deg) scale(1.1)';
    setTimeout(() => {
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeBtn.innerHTML = `<i class="fas fa-sun"></i>`;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeBtn.innerHTML = `<i class="fas fa-moon"></i>`;
        }
        themeBtn.style.transform = 'none';
    }, 200);
}

let index = 0;

function writeText() {
    const text = translations[currentLang].footer;
    const animatedText = document.getElementById('animated-text');
    if (animatedText) {
        animatedText.innerHTML = text.slice(0, index);
        index++;
        if (index > text.length) {
            index = 0; // Başa dönmesi için index'i sıfırlıyoruz
        }
    }
    setTimeout(writeText, 100); // Her adım 100ms sürecek
}

writeText();

window.addEventListener('DOMContentLoaded', initUI);
