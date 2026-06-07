/**
 * layout.js - המערכת המרכזית לטעינת רכיבים משותפים
 * קובץ זה חוסך שכפול קוד. יש לטעון אותו בכל עמוד באתר (index, codex, articles, etc.)
 */

document.addEventListener("DOMContentLoaded", () => {
    //    // 1. הזרקת סרגל הניווט העליון
    injectHeader();
    // 2. הזרקת הפוטר האחיד
    injectFooter();
    // 3. סימון העמוד הפעיל בסרגל
    highlightActiveLink();
});

function injectHeader() {
    const headerHTML = `
    <header class="bg-indigo-900 text-white shadow-lg sticky top-0 z-[60]">
        <div class="container mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div class="w-full md:w-auto flex justify-center md:justify-start">
                <h1 class="text-xl md:text-2xl font-bold text-white hover:scale-105 transition-transform">
                    <a href="index.html" class="flex items-center gap-3">
                        <img src="image_e42063.jpg" alt="השער - לוגו" class="w-10 h-10 object-contain drop-shadow-md rounded" onerror="this.style.display='none'">
                        השער
                    </a>
                </h1>
            </div>
            <nav class="flex w-full md:w-auto flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6 font-medium text-sm md:text-base border-t border-indigo-800 pt-3 md:border-0 md:pt-0">
                <div class="flex items-center gap-4 md:gap-6" id="global-nav-links">
                    <a href="index.html" class="nav-item hover:text-yellow-400 transition-colors" data-path="index">בית</a>
                    <a href="guide.html" class="nav-item hover:text-yellow-400 transition-colors" data-path="guide">המדריך למתחיל</a>
                    <a href="search.html" class="nav-item hover:text-yellow-400 transition-colors" data-path="search">פורטל חיפוש</a>
                    <a href="articles.html" class="nav-item hover:text-yellow-400 transition-colors" data-path="articles">מאמרים</a>
                    <a href="codex.html" class="nav-item hover:text-yellow-400 transition-colors" data-path="codex">קודקס</a>
                    <a href="msg.html" class="nav-item hover:text-yellow-400 transition-colors" data-path="msg">מבזקון</a>
                </div>
                <span class="hidden md:block w-px h-5 bg-indigo-500/50 mx-1"></span>
                <div class="flex items-center gap-2 bg-indigo-800/50 text-indigo-100 px-4 py-1.5 rounded-full border border-indigo-700/50 text-xs md:text-sm cursor-default select-none" title="האתר הרשמי של ארגון גמ&quot;ה">
                    <i class="fas fa-dice-d20 text-indigo-300"></i>
                    <span class="font-bold text-white tracking-wide">גמ"ה</span>
                </div>
            </nav>
        </div>
    </header>
    `;

    // יוצר דיב זמני כדי להמיר את המחרוזת ל-DOM ומכניס לתחילת ה-body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headerHTML;
    document.body.insertBefore(tempDiv.firstElementChild, document.body.firstChild);
}

function injectFooter() {
    const footerHTML = `
    <footer class="text-center py-8 mt-auto bg-stone-200 border-t border-stone-300 w-full">
        <p class="text-base text-stone-600 font-semibold mb-1">השער - פורטל משחקי התפקידים המאוחד של ישראל</p>
        <p class="text-sm text-stone-500 font-bold">
            ארגון גמ"ה - גלגול מיזמים התנדבותיים
        </p>
    </footer>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = footerHTML;
    document.body.appendChild(tempDiv.firstElementChild);
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.toLowerCase();
    const navItems = document.querySelectorAll('.nav-item');
    
    // Default to index if at root
    let activeMatched = false;

    navItems.forEach(item => {
        const pathData = item.getAttribute('data-path');
        if (currentPath.includes(pathData)) {
            item.classList.add('text-yellow-400', 'font-bold');
            activeMatched = true;
        }
    });

    // If nothing matched and we are at the root path, highlight Home
    if (!activeMatched && (currentPath === '/' || currentPath === '')) {
        const homeItem = document.querySelector('.nav-item[data-path="index"]');
        if(homeItem) homeItem.classList.add('text-yellow-400', 'font-bold');
    }
}
