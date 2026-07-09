let currentLang = 'tr';
let currentCategory = 'movies';
let xmlDoc = null;

// Sözlük bilgisi
const i18n = {
    tr: { movies: "Filmler", series: "Diziler", popularMovies: "Popüler Filmler", popularSeries: "Popüler Diziler", rating: "Puan", year: "Yıl", seasons: "Sezon", episodes: "Bölüm" },
    en: { movies: "Movies", series: "Series", popularMovies: "Popular Movies", popularSeries: "Popular Series", rating: "Score", year: "Year", seasons: "Season", episodes: "Episode" }
};

document.addEventListener("DOMContentLoaded", () => {
    loadXMLData();
});

// XML Veri Çekme
function loadXMLData() {
    fetch('data.xml')
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            xmlDoc = parser.parseFromString(data, "text/xml");
            renderGrid();
        })
        .catch(err => console.error("XML yükleme hatası:", err));
}

// Kategorileri Filtreleme (Film / Dizi)
function filterCategory(cat) {
    currentCategory = cat;
    document.getElementById('menu-movies').classList.toggle('active', cat === 'movies');
    document.getElementById('menu-series').classList.toggle('active', cat === 'series');
    
    document.getElementById('section-title').textContent = i18n[currentLang][cat === 'movies' ? 'popularMovies' : 'popularSeries'];
    renderGrid();
}

// Ana Ekrana Kartları Basma
function renderGrid() {
    const grid = document.getElementById('content-grid');
    grid.innerHTML = "";
    
    if(!xmlDoc) return;

    const items = currentCategory === 'movies' 
        ? xmlDoc.getElementsByTagName('movie') 
        : xmlDoc.getElementsByTagName('series_item');

    Array.from(items).forEach(item => {
        const id = item.getAttribute('id');
        const title = item.getElementsByTagName(`title_${currentLang}`)[0].textContent;
        const poster = item.getElementsByTagName('poster')[0].textContent;
        const rating = item.getElementsByTagName('rating')[0].textContent;
        const year = item.getElementsByTagName('year')[0].textContent;

        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openDetails(id, currentCategory);
        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="card-info">
                <h3>${title}</h3>
                <div class="meta">
                    <span>⭐ ${rating}</span>
                    <span>📅 ${year}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Detay ve Bölüm Kartlarını Açma Penceresi
function openDetails(id, type) {
    const modal = document.getElementById('detail-modal');
    const body = document.getElementById('modal-body');
    
    const selector = type === 'movies' ? 'movie' : 'series_item';
    const items = xmlDoc.getElementsByTagName(selector);
    let target = Array.from(items).find(x => x.getAttribute('id') === id);

    if(!target) return;

    const title = target.getElementsByTagName(`title_${currentLang}`)[0].textContent;
    const desc = target.getElementsByTagName(`desc_${currentLang}`)[0].textContent;

    if(type === 'movies') {
        const videoUrl = target.getElementsByTagName('video_url')[0].textContent;
        body.innerHTML = `
            <h2>${title}</h2>
            <video class="modern-player" controls autoplay src="${videoUrl}"></video>
            <p>${desc}</p>
        `;
    } else {
        // Eğer Diziyse Sezon ve Bölüm Kart Düzeni Oluşturulur
        let seasonsHTML = `<div class="season-tabs">`;
        let episodesHTML = `<div id="episodes-container" class="episode-grid"></div>`;
        
        const seasons = target.getElementsByTagName('season');
        Array.from(seasons).forEach((s, idx) => {
            const sNum = s.getAttribute('number');
            seasonsHTML += `<div class="season-tab ${idx===0?'active':''}" onclick="switchSeason(this, '${id}', '${sNum}')">${i18n[currentLang].seasons} ${sNum}</div>`;
        });
        seasonsHTML += `</div>`;

        body.innerHTML = `
            <h2>${title}</h2>
            <div id="player-wrapper"></div>
            <p style="margin-bottom:20px;">${desc}</p>
            ${seasonsHTML}
            ${episodesHTML}
        `;
        
        // İlk Sezonun Bölümlerini Yükle
        if(seasons.length > 0) {
            loadEpisodes(id, seasons[0].getAttribute('number'));
        }
    }
    modal.style.display = "block";
}

// Sezon Değiştirme Fonksiyonu
function switchSeason(element, seriesId, seasonNum) {
    document.querySelectorAll('.season-tab').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    loadEpisodes(seriesId, seasonNum);
}

// Bölüm Kartlarını Yükleme
function loadEpisodes(seriesId, seasonNum) {
    const container = document.getElementById('episodes-container');
    container.innerHTML = "";
    
    const series = Array.from(xmlDoc.getElementsByTagName('series_item')).find(x => x.getAttribute('id') === seriesId);
    const season = Array.from(series.getElementsByTagName('season')).find(x => x.getAttribute('number') === seasonNum);
    const episodes = season.getElementsByTagName('episode');

    Array.from(episodes).forEach(ep => {
        const epNum = ep.getAttribute('number');
        const epTitle = ep.getElementsByTagName(`title_${currentLang}`)[0].textContent;
        const videoUrl = ep.getElementsByTagName('video_url')[0].textContent;

        const epCard = document.createElement('div');
        epCard.className = 'episode-card';
        epCard.onclick = () => {
            document.getElementById('player-wrapper').innerHTML = `
                <video class="modern-player" controls autoplay src="${videoUrl}"></video>
            `;
        };
        epCard.innerHTML = `<strong>${i18n[currentLang].episodes} ${epNum}</strong><br><small>${epTitle}</small>`;
        container.appendChild(epCard);
    });
}

function closeModal() {
    document.getElementById('detail-modal').style.display = "none";
    document.getElementById('modal-body').innerHTML = ""; // Player'ı durdurmak için
}

// Karanlık / Aydınlık Mod Yönetimi
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    document.getElementById('theme-toggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Türkçe / İngilizce Dil Yönetimi
function toggleLanguage() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    document.getElementById('lang-toggle').textContent = currentLang === 'tr' ? 'EN' : 'TR';
    
    // Sabit menü isimlerini güncelle
    document.getElementById('menu-movies').textContent = i18n[currentLang].movies;
    document.getElementById('menu-series').textContent = i18n[currentLang].series;
    
    filterCategory(currentCategory);
}