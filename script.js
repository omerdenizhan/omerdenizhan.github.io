// --- Configuration ---
// İçeriğin çekileceği URL. GitHub raw linki kullanılmalıdır.
const MARKDOWN_URL = 'https://raw.githubusercontent.com/omerdenizhan/omerdenizhan/main/readme.md';

// --- Theme Management ---
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// Check local storage for theme preference, default to dark if nothing is found
let currentTheme = localStorage.getItem('theme') || 'dark';

// Function to apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Toggle icons with a slight rotation animation
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        themeToggleBtn.style.transform = "rotate(360deg)";
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        themeToggleBtn.style.transform = "rotate(-360deg)";
    }
}

// Initial theme setup
applyTheme(currentTheme);

// Toggle button click listener
themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
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
        
        // Use Marked.js to parse markdown to HTML
        const htmlContent = marked.parse(markdownText);
        
        // Add a small delay for aesthetic fade-in effect after loading
        setTimeout(() => {
            contentDiv.style.opacity = 0;
            setTimeout(() => {
                contentDiv.innerHTML = htmlContent;
                contentDiv.style.opacity = 1;
                contentDiv.style.transition = "opacity 0.5s ease-in";
            }, 200);
        }, 500);

    } catch (error) {
        contentDiv.innerHTML = `
            <div style="text-align:center; color: #ef4444;">
                <h3>Oops! Something went wrong.</h3>
                <p>Could not load the content. Please check the URL or your connection.</p>
                <small>${error.message}</small>
            </div>
        `;
        console.error("Fetch error:", error);
    }
}

// Start fetching content when page loads
fetchContent();
