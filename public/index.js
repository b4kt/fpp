 document.addEventListener('DOMContentLoaded', function() {
        const searchBar = document.getElementById('search');
        const toggleButton = document.getElementById('toggleButton');
     searchBar.style.width = 'auto';
searchBar.style.minWidth = '35rem';
searchBar.style.maxWidth = '100%';
function adjustWidth() {
    setTimeout(() => {
        searchBar.scrollTo(0, 0);
    }, 10);
}
searchBar.addEventListener('input', () => {
    adjustWidth();
});
        searchBar.addEventListener('focus', adjustWidth);
        adjustWidth();
        toggleButton.addEventListener('click', function() {
            if (searchBar.hasAttribute('data-target')) {
                searchBar.removeAttribute('data-target');
            } else {
                searchBar.setAttribute('data-target', '_blank');
            }
        });
    });
function isPhone() {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var aspectRatio = screenWidth / screenHeight;
    return screenWidth < 768 && aspectRatio < 1;
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is ready');
    if (isPhone()) {
        console.log('Device is a phone');
        document.body.innerHTML = `
            <h1 class="banner">Mobile support being fixed</h1>
        `;
    } else {
        console.log('Device is not a phone');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const searchEngineButton = document.getElementById('searchEngineButton');
    const searchInput = document.getElementById('search');
    searchEngineButton.addEventListener('click', function() {
        if (searchInput.getAttribute('data-search-engine') === 'https://google.com/search?q=%s') {
            searchInput.setAttribute('data-search-engine', 'https://search.brave.com/search?q=%s');
            searchEngineButton.textContent = 'use google search';
        } else {
            searchInput.setAttribute('data-search-engine', 'https://google.com/search?q=%s');
            searchEngineButton.textContent = 'use brave search';
        }
    });
});
