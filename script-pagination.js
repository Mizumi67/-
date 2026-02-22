// ===== Kotoba Pagination =====
let currentPage = 1;
const itemsPerPage = 20; // ~5 rows x 4 columns
let filteredKotoba = [...kotoba];

// Pagination controls
document.addEventListener('DOMContentLoaded', function() {
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    const pageInfo = document.getElementById('page-info');
    
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderKotobaPage();
            }
        });
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredKotoba.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderKotobaPage();
            }
        });
    }
});

// Render kotoba for current page
function renderKotobaPage() {
    const container = document.getElementById('kotoba-list');
    const pageInfo = document.getElementById('page-info');
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredKotoba.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #8D99AE;">Tidak ada kotoba yang ditemukan</p>';
        updatePaginationControls();
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredKotoba.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredKotoba.length);
    const pageItems = filteredKotoba.slice(startIndex, endIndex);
    
    // Render cards
    pageItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'kotoba-card';
        card.innerHTML = `
            <div class="kotoba-jp">${item.jp}</div>
            <div class="kotoba-romaji">${item.romaji}</div>
            <div class="kotoba-meaning">${item.meaning}</div>
        `;
        container.appendChild(card);
    });
    
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(filteredKotoba.length / itemsPerPage);
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    const pageInfo = document.getElementById('page-info');
    
    if (!prevArrow || !nextArrow || !pageInfo) return;
    
    // Update page info
    pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    
    // Update button states
    prevArrow.disabled = currentPage === 1;
    nextArrow.disabled = currentPage === totalPages || totalPages === 0;
}

// Override global renderKotoba
const originalRenderKotoba = window.renderKotoba;
window.renderKotoba = function(kotobaList = currentKotoba) {
    filteredKotoba = kotobaList;
    currentPage = 1; // Reset to page 1
    renderKotobaPage();
};
