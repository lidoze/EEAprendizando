const menusData = {
    html: [
        { name: "HTML Home", targetId: "content-html-home" },
        { name: "HTML Elementos", targetId: "content-html-elements" }
    ],
    css: [
        { name: "CSS Home", targetId: "content-css-home" },
        { name: "CSS Sintaxe", targetId: "content-css-syntax" }
    ],
    js: [
        { name: "JS Home", targetId: "content-js-home" },
        { name: "JS Variáveis", targetId: "content-js-variables" }
    ],
    php: [
        { name: "PHP Home", targetId: "content-php-home" },
        { name: "PHP Sintaxe", targetId: "content-php-syntax" }
    ],
    mysql: [
        { name: "MySQL Home", targetId: "content-mysql-home" },
        { name: "MySQL Criar Tabela", targetId: "content-mysql-create" }
    ]
};

let currentTab = 'html';

function switchTab(tabName) {
    currentTab = tabName;
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${tabName}`).classList.add('active');

    renderSidebar(tabName);
    const defaultPageId = menusData[tabName].targetId;
    navigateToPage(defaultPageId);
}

function renderSidebar(tabName) {
    const sidebar = document.getElementById('sidebar-container');
    let htmlContent = `<h3>Tutorial ${tabName.toUpperCase()}</h3>`;
    
    menusData[tabName].forEach(item => {
        htmlContent += `<a href="#" id="link-${item.targetId}" onclick="navigateToPage('${item.targetId}')">${item.name}</a>`;
    });
    
    sidebar.innerHTML = htmlContent;
}

function navigateToPage(pageId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.getElementById(`link-${pageId}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function executeSearch() {
    const input = document.getElementById('search-input').value.toLowerCase().trim();
    if (input === "") return;

    for (const category in menusData) {
        if (category === input) {
            switchTab(category);
            return;
        }
        for (const page of menusData[category]) {
            if (page.name.toLowerCase().includes(input)) {
                switchTab(category);
                navigateToPage(page.targetId);
                return;
            }
        }
    }
    alert("Não encontramos resultados! Tente procurar palavras simples como: HTML, CSS, JS, PHP, MySQL, Sintaxe ou Criar.");
}

function runCode(boxId) {
    const codeText = document.getElementById(boxId).innerText;
    alert("W3Schools Engine executando simulação:\n\n" + codeText);
}

document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        executeSearch();
    }
});

// Inicialização automática ao carregar a página
renderSidebar('html');
navigateToPage('content-html-home');