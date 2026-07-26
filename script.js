// --- Metin Verileri (TR / EN) ---
const i18n = {
  tr: {
    badge: "Sistem Güncelleniyor",
    title: "Yapım Aşamasında",
    desc: "Sizlere daha iyi bir deneyim sunabilmek için sistemlerimizi yeniliyoruz. Anlayışınız için teşekkür ederiz, en kısa sürede tekrar yayındayız."
  },
  en: {
    badge: "System Updating",
    title: "Under Construction",
    desc: "We are currently updating our systems to provide you with a better experience. Thank you for your patience, we will be back online shortly."
  }
};

let currentLang = 'tr';

// DOM Elemanları
const htmlEl = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const langBtn = document.getElementById('langToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const badgeText = document.getElementById('badgeText');
const titleText = document.getElementById('titleText');
const descText = document.getElementById('descText');

// --- Tema Değiştirme Mantığı ---
themeBtn.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlEl.setAttribute('data-theme', newTheme);

  if (newTheme === 'light') {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  } else {
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  }
});

// --- Dil Değiştirme Mantığı ---
langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'tr' ? 'en' : 'tr';
  htmlEl.setAttribute('lang', currentLang);

  // Metinleri Güncelle
  badgeText.textContent = i18n[currentLang].badge;
  titleText.textContent = i18n[currentLang].title;
  descText.textContent = i18n[currentLang].desc;
});
