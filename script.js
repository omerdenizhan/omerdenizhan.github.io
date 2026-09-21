let currentTheme = localStorage.getItem('site_theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
}

function initUI() {
    const topLeftDiv = document.querySelector('.top-left') || document.createElement('div');
    if (!topLeftDiv.classList.contains('top-left')) {
        topLeftDiv.className = 'top-left';
        topLeftDiv.innerHTML = `
            <a href="https://github.com/omerdenizhan" target="_blank" rel="noreferrer" class="top-btn" title="GitHub">
                <i class="fab fa-github"></i>
            </a>
        `;
        document.body.insertBefore(topLeftDiv, document.body.firstChild);
    }

    const topRightDiv = document.querySelector('.top-right') || document.createElement('div');
    if (!topRightDiv.classList.contains('top-right')) {
        topRightDiv.className = 'top-right';
        document.body.insertBefore(topRightDiv, document.body.firstChild.nextSibling);
    }

    let themeBtn = document.getElementById('theme-btn');
    if (!themeBtn) {
        themeBtn = document.createElement('button');
        themeBtn.className = 'top-btn';
        themeBtn.id = 'theme-btn';
        themeBtn.title = 'Tema Değiştir / Toggle Theme';
        themeBtn.addEventListener('click', toggleTheme);
        topRightDiv.appendChild(themeBtn);
    }

    if (currentTheme === 'dark') {
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('site_theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);

    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => {
            themeBtn.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            themeBtn.style.transform = 'none';
        }, 200);
    }
}

async function loadReadme() {
    const target = document.getElementById('readme-content');
    if (!target) return;

    try {
        const response = await fetch('https://raw.githubusercontent.com/omerdenizhan/omerdenizhan/refs/heads/main/README.MD');
        if (!response.ok) {
            throw new Error(`README yüklenemedi: ${response.status}`);
        }

        const markdown = await response.text();
        target.innerHTML = window.marked
            ? marked.parse(markdown, { breaks: true, gfm: true })
            : markdown;
    } catch (error) {
        target.innerHTML = `
            <section class="error-box">
                <h2>README yüklenemedi</h2>
                <p>GitHub README içeriği alınamadı. Lütfen daha sonra tekrar deneyin.</p>
            </section>
        `;
        console.error(error);
    }
}

let index = 0;

function writeText() {
    const text = '2026 Unlicensed | Ömer Denizhan';
    const animatedText = document.getElementById('animated-text');
    if (animatedText) {
        animatedText.innerHTML = text.slice(0, index);
        index++;
        if (index > text.length) {
            index = 0;
        }
    }
    setTimeout(writeText, 100);
}

window.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadReadme();
    writeText();
});
