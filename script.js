// --- Configuration ---
const MARKDOWN_URL = 'https://raw.githubusercontent.com/omerdenizhan/omerdenizhan/main/readme.md';

// --- Theme Management ---
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// Default to Dark Mode
let isDarkMode = localStorage.getItem('theme') !== 'light';

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

applyTheme();

themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    themeToggleBtn.style.transform = isDarkMode ? "rotate(360deg) scale(1.1)" : "rotate(-360deg) scale(1.1)";
    setTimeout(() => { themeToggleBtn.style.transform = "none"; }, 500);
    applyTheme();
});

// --- Dynamic Markdown Splitter & Card Generator ---
async function fetchAndRenderCards() {
    const wrapper = document.getElementById('cards-wrapper');
    
    try {
        const response = await fetch(MARKDOWN_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const markdownText = await response.text();
        
        const lines = markdownText.split('\n');
        let sections = [];
        let currentSection = [];
        
        for (let line of lines) {
            // Başlık yapılarına (#, ##, ###) göre ayırma
            if (/^#{1,3}\s/.test(line.trim())) {
                if (currentSection.length > 0) {
                    sections.push(currentSection.join('\n'));
                }
                currentSection = [line];
            } else {
                currentSection.push(line);
            }
        }
        if (currentSection.length > 0) {
            sections.push(currentSection.join('\n'));
        }
        
        // Spinner'ı temizle
        wrapper.innerHTML = '';
        
        // Bölümleri ayrı kartlara bas
        sections.forEach((sectionMarkdown) => {
            if (sectionMarkdown.trim() === '') return;
            
            const cardElement = document.createElement('div');
            cardElement.className = 'profile-card';
            
            cardElement.innerHTML = marked.parse(sectionMarkdown);
            wrapper.appendChild(cardElement);
        });

    } catch (error) {
        wrapper.innerHTML = `
            <div class="profile-card" style="text-align:center; border: 1px solid #ef4444;">
                <h3 style="color:#ef4444;">Connection Error</h3>
                <p>Failed to parse the GitHub README file. Please check the repository URL.</p>
                <small style="color:var(--text-muted);">${error.message}</small>
            </div>
        `;
        console.error("Error loading content:", error);
    }
}

// Initialize
fetchAndRenderCards();
