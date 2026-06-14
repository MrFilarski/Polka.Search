// Handles theme switching and language links
(function(){
    const root = document.documentElement;
    const THEME_KEY = 'polka_theme';

    function applyTheme(theme){
        if(theme === 'dark'){
            root.classList.remove('light-theme');
            root.classList.add('dark-theme');
        } else {
            root.classList.remove('dark-theme');
            root.classList.add('light-theme');
        }
    }

    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(saved);

    window.toggleTheme = function(){
        const cur = localStorage.getItem(THEME_KEY) || 'dark';
        const next = cur === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    };
})();
