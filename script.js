// --- Configuration ---
const MARKDOWN_URL = 'https://raw.githubusercontent.com/omerdenizhan/omerdenizhan/main/readme.md';

// --- Theme Management ---
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// LocalStorage kontrolü (Varsayılan olarak Koyu Mod başlatıyoruz)
let isDarkMode = localStorage.getItem('theme') !== 'light'; // Eğer 'light' değilse dark mod olsun

function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        localStorage.setItem('theme', 'light');
    }
}

// Sayfa yüklendiğinde temayı uygula
applyTheme();

// Butona tıklandığında temayı değiştir
themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    
    // Basit bir dönüş animasyonu
    themeToggleBtn.style.transform = isDarkMode ? "rotate(360deg)" : "rotate(-360deg)";
    setTimeout(() => { themeToggleBtn.style.transform = "none"; }, 400);

    applyTheme();
});

// --- Fetch and Render Markdown Content ---
async function fetchContent() {
    const contentDiv = document.getElementById('content');
    
    try {
        const response = await fetch(MARKDOWN_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdownText = await response.text();
        const htmlContent = marked.parse(markdownText);
        
        contentDiv.style.opacity = 0;
        setTimeout(() => {
            contentDiv.innerHTML = htmlContent;
            contentDiv.style.opacity = 1;
            contentDiv.style.transition = "opacity 0.5s ease-in";
        }, 300);

    } catch (error) {
        contentDiv.innerHTML = `
            <div style="text-align:center; color: #ef4444;">
                <h3>Oops! Content could not be loaded.</h3>
                <p>Please check your internet connection or the GitHub URL.</p>
                <small>${error.message}</small>
            </div>
        `;
        console.error("Fetch error:", error);
    }
}

// Fetch işlemini başlat
fetchContent();
