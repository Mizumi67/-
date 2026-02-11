// ===== Wait for DOM to load =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded!');
    
    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Save preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Render all kana
    renderKana('hiragana-dasar', hiragana_dasar);
    renderKana('hiragana-dakuten', hiragana_dakuten);
    renderKana('hiragana-handakuten', hiragana_handakuten);
    renderKana('hiragana-youon', hiragana_youon);
    
    renderKana('katakana-dasar', katakana_dasar);
    renderKana('katakana-dakuten', katakana_dakuten);
    renderKana('katakana-handakuten', katakana_handakuten);
    renderKana('katakana-youon', katakana_youon);
    renderKana('katakana-modern', katakana_modern);
    
    // Render kotoba
    renderKotoba();
    setupKotobaFilters();
    setupKotobaSearch();
});

// ===== Render Kana =====
function renderKana(containerId, dataArray) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log('Container not found:', containerId);
        return;
    }
    
    container.innerHTML = '';
    
    dataArray.forEach(item => {
        const kanaItem = document.createElement('div');
        kanaItem.className = 'kana-item';
        kanaItem.innerHTML = `
            <span class="kana-char">${item.char}</span>
            <span class="kana-romaji">${item.romaji}</span>
        `;
        
        kanaItem.addEventListener('click', () => {
            showCharacterModal(item);
        });
        
        container.appendChild(kanaItem);
    });
}

// ===== Character Modal =====
function showCharacterModal(charData) {
    const modal = document.getElementById('char-modal');
    const modalChar = document.getElementById('modal-char');
    const modalRomaji = document.getElementById('modal-romaji');
    const strokeDesc = document.getElementById('stroke-desc');
    const strokeVisual = document.getElementById('stroke-visual');
    
    modalChar.textContent = charData.char;
    modalRomaji.textContent = charData.romaji.toUpperCase();
    
    if (charData.strokes) {
        strokeDesc.textContent = charData.strokes;
        strokeVisual.textContent = '📝 Tulis huruf ini dengan mengikuti urutan goresan dari atas ke bawah dan kiri ke kanan';
    } else {
        strokeDesc.textContent = 'Urutan penulisan sama dengan huruf dasarnya';
        strokeVisual.textContent = '💡 Ikuti urutan penulisan huruf dasar, lalu tambahkan tanda dakuten/handakuten di akhir';
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('char-modal').classList.remove('active');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('char-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// ===== Render Kotoba =====
let currentKotoba = [...kotoba];

function renderKotoba(kotobaList = currentKotoba) {
    const container = document.getElementById('kotoba-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (kotobaList.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #8D99AE;">Tidak ada kotoba yang ditemukan</p>';
        return;
    }
    
    kotobaList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'kotoba-card';
        card.innerHTML = `
            <div class="kotoba-jp">${item.jp}</div>
            <div class="kotoba-romaji">${item.romaji}</div>
            <div class="kotoba-meaning">${item.meaning}</div>
        `;
        container.appendChild(card);
    });
}

// ===== Kotoba Filters =====
function setupKotobaFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            if (filter === 'all') {
                currentKotoba = [...kotoba];
            } else {
                currentKotoba = kotoba.filter(k => k.category === filter);
            }
            
            renderKotoba(currentKotoba);
        });
    });
}

// ===== Kotoba Search =====
function setupKotobaSearch() {
    const searchInput = document.getElementById('kotoba-search');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filtered = currentKotoba.filter(k => {
            return k.jp.includes(searchTerm) ||
                   k.romaji.toLowerCase().includes(searchTerm) ||
                   k.meaning.toLowerCase().includes(searchTerm);
        });
        
        renderKotoba(filtered);
    });
}

// ===== Open Game =====
function openGame(gameType) {
    console.log('Opening game:', gameType);
    window.open(`game.html?type=${gameType}`, '_blank');
}

// ===== Dark Mode Functionality =====
(function() {
    // Setup dark mode on load
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    // Wait for DOM
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                body.classList.toggle('dark-mode');
                
                // Save preference
                if (body.classList.contains('dark-mode')) {
                    localStorage.setItem('theme', 'dark');
                } else {
                    localStorage.setItem('theme', 'light');
                }
            });
        }
    });
})();
