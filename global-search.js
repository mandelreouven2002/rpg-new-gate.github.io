/**
 * global-search.js
 * מבצע חיפוש רוחבי בכל משאבי האתר: קהילות (data.json), קודקס (terms.json) ומאמרים.
 */

document.addEventListener("DOMContentLoaded", () => {
    //    const searchInput = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('search-results-dropdown');
    
    if (!searchInput || !resultsContainer) return;

    let codexData = [];
    let communityData = [];
    let articlesData = [
        { title: "מה זה משחקי תפקידים?", desc: "המדריך הבסיסי שמסביר את הקונספט של כניסה לנעלי דמות אחרת.", link: "articles.html" },
        { title: "משחק תפקידים שולחני (TTRPG)", desc: "איך משחקים עם דף, עפרון וקוביות? צלילה לעולם סביב השולחן.", link: "articles.html" },
        { title: "משחק חי (LARP)", desc: "לצאת מהשולחן וללבוש תחפושת. מה זה לארפ?", link: "articles.html" },
        { title: "נימוסי שולחן ותרבות משחק", desc: "המדריך הלא-כתוב לשחקן המוצלח - איך להתנהג סביב השולחן.", link: "articles.html" },
        { title: "מבוכים ודרקונים (D&D 5e)", desc: "סקירת השיטה הפופולרית ביותר בעולם.", link: "articles.html" },
        { title: "פאת'פיינדר", desc: "עולם הפנטזיה העשיר של פאת'פיינדר.", link: "articles.html" }
    ];

    let isDataLoaded = false;

    //    async function fetchResources() {
        try {
            const termsRes = await fetch('terms.json');
            if (termsRes.ok) codexData = await termsRes.json();

            const dataRes = await fetch('data.json');
            if (dataRes.ok) {
                const json = await dataRes.json();
                communityData = [...(json.communityData || []), ...(json.resourcesData || [])];
            }
            
            isDataLoaded = true;
        } catch (e) {
            console.error("שגיאה בטעינת נתוני החיפוש:", e);
        }
    }

    fetchResources();

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            resultsContainer.classList.add('hidden');
            return;
        }

        if (!isDataLoaded) {
            showLoadingState();
            return;
        }

        performGlobalSearch(query);
    });

    //    function performGlobalSearch(query) {
        const codexResults = codexData.filter(term => 
            term.word.toLowerCase().includes(query) || 
            term.sourceEn.toLowerCase().includes(query)
        ).slice(0, 3);

        const articleResults = articlesData.filter(art => 
            art.title.toLowerCase().includes(query) || 
            art.desc.toLowerCase().includes(query)
        ).slice(0, 3);

        const communityResults = communityData.filter(item => 
            (item.name && item.name.toLowerCase().includes(query)) || 
            (item.description && item.description.toLowerCase().includes(query)) ||
            (item.location && item.location.toLowerCase().includes(query))
        ).slice(0, 3);

        renderResults(codexResults, articleResults, communityResults, query);
    }

    //    function renderResults(codex, articles, community, query) {
        resultsContainer.innerHTML = '';
        const totalResults = codex.length + articles.length + community.length;
        
        if (totalResults === 0) {
            resultsContainer.innerHTML = `
                <div class="p-6 text-center text-gray-500">
                    <span class="text-2xl block mb-2">🔍</span>
                    לא מצאנו תוצאות עבור "<span class="font-bold text-gray-800">${query}</span>"
                </div>`;
            resultsContainer.classList.remove('hidden');
            return;
        }

        let html = '';

        if (articles.length > 0) {
            html += `<div class="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 tracking-wider">במאמרים ומדריכים</div>`;
            articles.forEach(art => {
                html += `
                <a href="${art.link}" class="block px-4 py-3 hover:bg-indigo-50 transition-colors">
                    <div class="font-bold text-indigo-700 text-sm mb-1">${art.title}</div>
                    <div class="text-xs text-gray-600 truncate">${art.desc}</div>
                </a>`;
            });
        }

        if (codex.length > 0) {
            html += `<div class="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 tracking-wider">במילון המונחים (קודקס)</div>`;
            codex.forEach(term => {
                html += `
                <a href="codex.html#${encodeURIComponent(term.word)}" class="block px-4 py-3 hover:bg-amber-50 transition-colors">
                    <div class="font-bold text-amber-700 text-sm mb-1">${term.word} <span class="text-gray-400 font-normal ml-1">(${term.sourceEn})</span></div>
                    <div class="text-xs text-gray-600 truncate">${term.definition.substring(0,60)}...</div>
                </a>`;
            });
        }

        if (community.length > 0) {
            html += `<div class="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 tracking-wider">בקהילות, אירועים וחנויות</div>`;
            community.forEach(item => {
                html += `
                <a href="${item.link || 'search.html'}" target="_blank" class="block px-4 py-3 hover:bg-green-50 transition-colors">
                    <div class="flex items-center gap-2 mb-1">
                        <div class="font-bold text-green-700 text-sm">${item.name}</div>
                        ${item.location ? `<span class="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">📍 ${item.location}</span>` : ''}
                    </div>
                    <div class="text-xs text-gray-600 truncate">${item.description || ''}</div>
                </a>`;
            });
        }

        resultsContainer.innerHTML = html;
        resultsContainer.classList.remove('hidden');
    }

    function showLoadingState() {
        resultsContainer.innerHTML = `<div class="p-4 text-center text-sm text-gray-500">טוען נתונים למנוע החיפוש...</div>`;
        resultsContainer.classList.remove('hidden');
    }

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });
});
