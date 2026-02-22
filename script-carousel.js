// ===== Kotoba Carousel Multi-Row =====
document.addEventListener('DOMContentLoaded', function() {
    const kotobaGrid = document.getElementById('kotoba-list');
    const leftArrow = document.getElementById('carousel-left');
    const rightArrow = document.getElementById('carousel-right');
    
    if (!kotobaGrid || !leftArrow || !rightArrow) return;
    
    // Scroll by one "page" (viewport width)
    function scrollCarousel(direction) {
        const scrollAmount = kotobaGrid.clientWidth * 0.9; // 90% of visible width
        
        if (direction === 'left') {
            kotobaGrid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            kotobaGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }
    
    // Update arrow states
    function updateArrows() {
        const scrollLeft = kotobaGrid.scrollLeft;
        const maxScroll = kotobaGrid.scrollWidth - kotobaGrid.clientWidth;
        
        // Disable left arrow if at start
        leftArrow.disabled = scrollLeft <= 1;
        
        // Disable right arrow if at end
        rightArrow.disabled = scrollLeft >= maxScroll - 1;
    }
    
    // Event listeners
    leftArrow.addEventListener('click', () => scrollCarousel('left'));
    rightArrow.addEventListener('click', () => scrollCarousel('right'));
    
    // Update on scroll
    kotobaGrid.addEventListener('scroll', updateArrows);
    
    // Update on resize
    window.addEventListener('resize', updateArrows);
    
    // Initial check
    setTimeout(updateArrows, 100);
    
    // Update arrows when kotoba is filtered/searched
    const observer = new MutationObserver(updateArrows);
    observer.observe(kotobaGrid, { childList: true });
});
