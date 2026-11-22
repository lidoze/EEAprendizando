'use strict';

/* =====================================================
   Utilidades
   ===================================================== */
const $ = (s) => document.querySelector(s);

const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

function esc(s) {
    return String(s === null || s === undefined ? 'NULL' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let toastTimer = null;
function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
}

/* =====================================================
   Colorização de código
   ===================================================== */
const KW_JS = /\b(?:const|let|var|function|return|if|else|for|while|true|false|null|undefined|new|typeof|this)\b/;
const KW_PHP = /\b(?:echo|if|else|elseif|foreach|for|while|function|return|array|true|false|null|as|class|new|isset|empty)\b/;
const KW_SQL = /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|ORDER|BY|GROUP|LIMIT|AND|OR|NOT|NULL|AS|DESC|ASC|JOIN|ON|CREATE|TABLE|DROP|LIKE|IN)\b/;

const RULES = {
    html: [
        ['comment', /<!--[\s\S]*?-->/],
        ['keyword', /<!DOCTYPE[^>]*>/i],
        ['tag', /<\/?[a-zA-Z][\w-]*|\/?>/],
        ['attr', /[\w-]+(?==)/],
        ['string', /"[^"]*"|'[^']*'/]
    ],
    css: [
        ['comment', /\/\*[\s\S]*?\*\//],
        ['string', /"[^"]*"|'[^']*'/],
        ['at', /@[\w-]+/],
        ['prop', /[\w-]+(?=\s*:[^{};]*[;}])/],
        ['number', /#[0-9a-fA-F]{3,8}\b|(?<![\w-])-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|deg)?/]
    ],
    js: [
        ['comment', /\/\/.*|\/\*[\s\S]*?\*\//],
        ['string', /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/],
        ['keyword', KW_JS],
        ['number', /\b\d+(?:\.\d+)?\b/],
        ['fn', /\b[a-zA-Z_]\w*(?=\()/]
    ],
    php: [
        ['comment', /\/\/.*|\/\*[\s\S]*?\*\//],
        ['string', /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/],
        ['tag', /<\?php|\?>|<\/?[a-zA-Z][\w-]*|\/?>/],
        ['var', /\$\w+/],
        ['keyword', KW_PHP],
        ['number', /\b\d+(?:\.\d+)?\b/],
        ['fn', /\b[a-zA-Z_]\w*(?=\()/]
    ],
    sql: [
        ['comment', /--.*/],
        ['string', /'(?:''|[^'])*'/],
        ['keyword', KW_SQL],
        ['number', /\b\d+(?:\.\d+)?\b/],
        ['fn', /\b[a-zA-Z_]\w*(?=\()/]
    ]
};

function highlight(code, lang) {
    const rules = RULES[lang];
    if (!rules) return esc(code);
    const re = new RegExp(rules.map(r => '(' + r[1].source + ')').join('|'), lang === 'sql' ? 'gi' : 'g');
    let out = '', last = 0, m;
    while ((m = re.exec(code)) !== null) {
        if (m[0] === '') { re.lastIndex++; continue; }
        const k = rules.findIndex((_, i) => m[i + 1] !== undefined);
        out += esc(code.slice(last, m.index)) + `<span class="tk-${rules[k][0]}">${esc(m[0])}</span>`;
        last = re.lastIndex;
    }
    return out + esc(code.slice(last));
}

/* =====================================================
   Estado e progresso
   ===================================================== */
const state = {
    lang: null,
    idx: 0,
    user: null,
    done: new Set(store.get('w3pro_done', []))
};

const cur = () => LESSONS[state.lang][state.idx];
const langKeys = Object.keys(LANGS);

function saveDone() { store.set('w3pro_done', [...state.done]); }

function prog(k) {
    const total = LESSONS[k].length;
    const done = LESSONS[k].filter(l => state.done.has(l.id)).length;
    return { total, done, pct: Math.round((done / total) * 100) };
}

function markDone(id) {
    if (state.done.has(id)) return;
    state.done.add(id);
    saveDone();
    if (state.user) {
        api('progress_set', { lesson: id })
            .then(r => { if (r.data && r.data.sql) logSQL(r.data.sql, 'Progresso salvo'); })
            .catch(() => {});
    }
    renderSidebar();
    toast('Lição concluída! 🎉');
}

async function syncProgress() {
    try {
        const r = await api('progress_get');
        if (r.status !== 200) return;
        const server = new Set(r.data.lessons);
        server.forEach(id => state.done.add(id));
        for (const id of state.done) {
            if (!server.has(id)) await api('progress_set', { lesson: id });
        }
        saveDone();
        route();
    } catch (e) { /* sem backend: segue só com o progresso local */ }
}

/* =====================================================
   Rotas e telas
   ===================================================== */
function route() {
    const m = location.hash.match(/^#\/(\w+)\/(\d+)/);
    if (m && LESSONS[m[1]]) {
        state.lang = m[1];
        state.idx = Math.min(Math.max(parseInt(m[2], 10) - 1, 0), LESSONS[m[1]].length - 1);
        renderLesson();
        store.set('w3pro_last', { lang: state.lang, idx: state.idx });
        document.title = `${cur().title} | ${LANGS[state.lang].name} | W3 Pro`;
    } else {
        state.lang = null;
        renderHome();
        document.title = 'W3 Pro | Aprenda HTML, CSS, JavaScript, PHP e MySQL';
    }
    renderTabs();
    renderSidebar();
    document.body.classList.remove('side-open');
    hideSearch();
    window.scrollTo(0, 0);
}

function renderTabs() {
    $('#tabs').innerHTML = langKeys.map(k =>
        `<a class="tab ${state.lang === k ? 'active' : ''}" href="#/${k}/1">${LANGS[k].name}</a>`).join('');
}

function renderSidebar() {
    const sb = $('#sidebar');
    if (!state.lang) {
        sb.innerHTML = '<h3>Linguagens</h3>' + langKeys.map(k => {
            const p = prog(k);
            return `<a href="#/${k}/1"><span class="dot" style="background:${LANGS[k].color}"></span>${LANGS[k].name}<small>${p.done}/${p.total}</small></a>`;
        }).join('');
        return;
    }
    const p = prog(state.lang);
    sb.innerHTML = `<h3>${LANGS[state.lang].name}</h3>
        <div class="bar"><i style="width:${p.pct}%"></i></div>
        <div class="bar-label">${p.done} de ${p.total} lições concluídas</div>` +
        LESSONS[state.lang].map((l, i) =>
            `<a href="#/${state.lang}/${i + 1}" class="${i === state.idx ? 'active' : ''} ${state.done.has(l.id) ? 'done' : ''}"><span class="check"></span>${l.title}</a>`
        ).join('');
}

function renderHome() {
    const last = store.get('w3pro_last', null);
    const startHref = last && LESSONS[last.lang] ? `#/${last.lang}/${last.idx + 1}` : '#/html/1';
    const cards = langKeys.map(k => {
        const p = prog(k);
        return `<a class="lang-card" href="#/${k}/1">
            <span class="badge" style="background:${LANGS[k].color}">${LANGS[k].name}</span>
            <h3>Aprenda ${LANGS[k].name}</h3>
            <p>${LANGS[k].desc}</p>
            <div class="meta"><span>${p.total} lições</span><span>${p.pct}%</span></div>
            <div class="bar"><i style="width:${p.pct}%"></i></div>
        </a>`;
    }).join('');

    $('#content').innerHTML = `
        <section class="hero">
            <h1>Aprenda a programar na prática</h1>
            <p>Lições curtas, editor ao vivo, quizzes e um MySQL de verdade, tudo em um só lugar.</p>
            <a class="btn" href="${startHref}">${last ? 'Continuar de onde parou »' : 'Começar agora »'}</a>
        </section>
        <h2 class="home-title">Escolha uma linguagem</h2>
        <div class="cards">${cards}</div>`;
}

/* ---------- Lição ---------- */
const codes = [];

function block(label, code, lang, buttons, after) {
    const i = codes.push(code) - 1;
    return `<div class="example">
        <div class="example-head"><span>${label}</span>
            <div class="btns">${buttons || ''}<button class="btn ghost small" onclick="copyCode(${i}, this)">Copiar</button></div>
        </div>
        <pre><code>${highlight(code, lang)}</code></pre>${after || ''}
    </div>`;
}

function renderLesson() {
    codes.length = 0;
    const L = cur();
    const n = LESSONS[state.lang].length;

    let ex = '';
    if (L.html) ex += block('HTML usado no exemplo', L.html, 'html');
    const label = { html: 'HTML', css: 'CSS', js: 'JavaScript', php: 'PHP', sql: 'SQL' }[L.lang];
    const tryBtn = L.lang === 'php'
        ? '<button class="btn small" onclick="togglePhp(this)">Ver saída</button>'
        : '<button class="btn small" onclick="openTry()">Experimente você mesmo »</button>';
    const phpOut = L.lang === 'php' ? `<div class="php-out hidden" id="php-out"><b>Saída</b>${esc(L.out)}</div>` : '';
    ex += block(label, L.code, L.lang, tryBtn, phpOut);

    const quiz = L.quiz ? `<section class="quiz">
            <h3>Teste rápido</h3>
            <p>${esc(L.quiz.q)}</p>
            <div class="opts">${L.quiz.o.map((o, i) => `<button onclick="answer(${i})">${esc(o)}</button>`).join('')}</div>
            <div id="quiz-msg"></div>
        </section>` : '';

    $('#content').innerHTML = `
        <div class="crumbs"><a href="#/">Início</a> › <a href="#/${state.lang}/1">${LANGS[state.lang].name}</a> › Lição ${state.idx + 1} de ${n}</div>
        <h1>${L.title}</h1>
        <div class="lesson-body">${L.body}</div>
        ${ex}
        ${quiz}
        <div class="pager">
            <a class="btn ghost" href="${prevHref()}">« Anterior</a>
            <button class="btn" onclick="concluir()">Concluir ✓ e continuar</button>
            <a class="btn ghost" href="${nextHref()}">Próxima »</a>
        </div>`;
}

function nextHref() {
    if (state.idx < LESSONS[state.lang].length - 1) return `#/${state.lang}/${state.idx + 2}`;
    const k = langKeys[langKeys.indexOf(state.lang) + 1];
    return k ? `#/${k}/1` : '#/';
}

function prevHref() {
    if (state.idx > 0) return `#/${state.lang}/${state.idx}`;
    const k = langKeys[langKeys.indexOf(state.lang) - 1];
    return k ? `#/${k}/${LESSONS[k].length}` : '#/';
}

function concluir() {
    markDone(cur().id);
    location.hash = nextHref();
}

function answer(i) {
    const L = cur();
    const btns = document.querySelectorAll('.opts button');
    const ok = i === L.quiz.a;
    btns[i].classList.add(ok ? 'right' : 'wrong');
    $('#quiz-msg').textContent = ok ? 'Correto! Lição concluída. 🎉' : 'Não foi dessa vez. Tente outra opção.';
    if (ok) {
        btns.forEach(b => b.disabled = true);
        markDone(L.id);
    }
}

function copyCode(i, btn) {
    navigator.clipboard.writeText(codes[i]).then(() => {
        btn.textContent = 'Copiado!';
        setTimeout(() => btn.textContent = 'Copiar', 1500);
    }).catch(() => toast('Não foi possível copiar.'));
}

function togglePhp(btn) {
    const o = $('#php-out');
    o.classList.toggle('hidden');
    btn.textContent = o.classList.contains('hidden') ? 'Ver saída' : 'Ocultar saída';
}

function toggleSidebar() { document.body.classList.toggle('side-open'); }

/* =====================================================
   Busca
   ===================================================== */
const INDEX = [];
langKeys.forEach(lang => LESSONS[lang].forEach((l, i) => {
    const plain = l.body.replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    INDEX.push({ lang, i, title: l.title, text: (LANGS[lang].name + ' ' + l.title + ' ' + plain + ' ' + l.code).toLowerCase() });
}));

let searchSel = -1;

function hideSearch() { $('#search-results').classList.add('hidden'); searchSel = -1; }

function doSearch() {
    const q = $('#search-input').value.toLowerCase().trim();
    const box = $('#search-results');
    if (!q) { hideSearch(); return; }
    const words = q.split(/\s+/);
    const hits = INDEX.filter(it => words.every(w => it.text.includes(w)))
        .sort((a, b) => (b.title.toLowerCase().includes(q) ? 1 : 0) - (a.title.toLowerCase().includes(q) ? 1 : 0))
        .slice(0, 8);
    searchSel = hits.length ? 0 : -1;
    box.innerHTML = hits.length
        ? hits.map((h, n) => `<a href="#/${h.lang}/${h.i + 1}" class="${n === 0 ? 'sel' : ''}"><span class="badge" style="background:${LANGS[h.lang].color}">${LANGS[h.lang].name}</span>${esc(h.title)}</a>`).join('')
        : '<div class="empty">Nada encontrado. Tente outra palavra.</div>';
    box.classList.remove('hidden');
}

function moveSearch(d) {
    const items = [...document.querySelectorAll('#search-results a')];
    if (!items.length) return;
    items.forEach(a => a.classList.remove('sel'));
    searchSel = (searchSel + d + items.length) % items.length;
    items[searchSel].classList.add('sel');
}

$('#search-input').addEventListener('input', doSearch);
$('#search-input').addEventListener('focus', doSearch);
$('#search-input').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSearch(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSearch(-1); }
    else if (e.key === 'Enter') {
        const sel = document.querySelector('#search-results a.sel');
        if (sel) { location.hash = sel.getAttribute('href'); $('#search-input').blur(); }
    } else if (e.key === 'Escape') { hideSearch(); $('#search-input').blur(); }
});
$('#search-input').addEventListener('blur', () => setTimeout(hideSearch, 160));

/* =====================================================
   Tema
   ===================================================== */
function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    $('#theme-btn').textContent = t === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(t);
    store.set('EEAcode_theme', t);
}

/* =====================================================
   Backend (PHP + MySQL)
   ===================================================== */
const NO_BACKEND_MSG =
    'Não consegui falar com o PHP/MySQL. Abra o site por um servidor PHP: na pasta do projeto rode ' +
    '"php -S localhost:8000" e acesse http://localhost:8000 (ou use a pasta htdocs do XAMPP). ' +
    'Abrir o index.html direto do arquivo não funciona para login e MySQL.';

async function api(action, body) {
    let res;
    try {
        res = await fetch('api.php?action=' + action, {
            method: body ? 'POST' : 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'same-origin'
        });
    } catch (e) { throw new Error('NO_BACKEND'); }
    let data;
    try { data = await res.json(); } catch (e) { throw new Error('NO_BACKEND'); }
    return { status: res.status, data };
}

const backendMsg = (e) => e.message === 'NO_BACKEND' ? NO_BACKEND_MSG : 'Erro: ' + e.message;

function tableHTML(res) {
    let h = '<div style="overflow:auto"><table class="sql-table"><thead><tr>' +
        res.columns.map(c => `<th>${esc(c)}</th>`).join('') + '</tr></thead><tbody>';
    res.values.forEach(r => { h += '<tr>' + r.map(c => `<td>${esc(c)}</td>`).join('') + '</tr>'; });
    return h + `</tbody></table></div><div class="row-count">${res.values.length} linha(s)</div>`;
}

/* =====================================================
   Editor "Experimente você mesmo"
   ===================================================== */
let tryLesson = null;

const CONSOLE_SHIM = '<pre id="__console" style="margin-top:16px;padding:10px;background:#111827;color:#d1fae5;border-radius:8px;font-size:13px;white-space:pre-wrap;min-height:20px"></pre>' +
    '<script>(function(){var o=document.getElementById("__console");' +
    'function w(t,c){var d=document.createElement("div");d.textContent=t;if(c)d.style.color=c;o.appendChild(d)}' +
    'console.log=function(){w([].slice.call(arguments).map(function(a){try{return typeof a==="object"?JSON.stringify(a):String(a)}catch(e){return String(a)}}).join(" "))};' +
    'window.onerror=function(m){w("Erro: "+m,"#fca5a5")}})()<\/script>';

function openTry() {
    const L = cur();
    tryLesson = L;
    const sql = L.lang === 'sql';
    $('#try-title').textContent = 'Experimente você mesmo · ' + LANGS[state.lang].name;
    $('#try-editor').value = L.code;
    $('#try-frame').classList.toggle('hidden', sql);
    $('#try-sql').classList.toggle('hidden', !sql);
    $('#try-reset-lab').classList.toggle('hidden', !sql);
    $('#try-sql').innerHTML = '<span class="muted">Clique em Executar para rodar o comando no MySQL.</span>';
    $('#try-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (!sql) runTry();
    $('#try-editor').focus();
}

function closeTry() {
    $('#try-modal').classList.add('hidden');
    $('#try-frame').srcdoc = '';
    document.body.style.overflow = '';
}

function restoreTry() {
    $('#try-editor').value = tryLesson.code;
    if (tryLesson.lang !== 'sql') runTry();
}

async function runTry() {
    const L = tryLesson;
    const code = $('#try-editor').value;

    if (L.lang === 'sql') {
        const box = $('#try-sql');
        box.innerHTML = '<span class="muted">Executando…</span>';
        try {
            const { data } = await api('query', { sql: code });
            if (data.error) box.innerHTML = `<div class="err-text">Erro MySQL: ${esc(data.error)}</div>`;
            else if (data.columns) box.innerHTML = tableHTML(data);
            else box.innerHTML = `<div class="ok-text">Query OK, ${data.affected} linha(s) afetada(s).</div><p class="row-count">Rode <code>SELECT * FROM clientes;</code> para ver a tabela.</p>`;
        } catch (e) {
            box.innerHTML = `<div class="err-text">${esc(backendMsg(e))}</div>`;
        }
        return;
    }

    let doc;
    if (L.lang === 'html') {
        doc = code;
    } else if (L.lang === 'css') {
        doc = '<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;padding:16px}</style><style>' + code + '</style>' + L.html;
    } else {
        doc = '<!doctype html><meta charset="utf-8"><body style="font-family:system-ui,sans-serif;padding:16px">' +
              (L.html || '') + CONSOLE_SHIM + '<script>' + code + '<\/script></body>';
    }
    $('#try-frame').srcdoc = doc;
}

async function resetLab() {
    try {
        const { data } = await api('lab_reset', {});
        if (data.ok) {
            toast('Tabela clientes restaurada.');
            $('#try-sql').innerHTML = '<div class="ok-text">Tabela clientes restaurada ao estado original.</div>';
        } else {
            $('#try-sql').innerHTML = `<div class="err-text">${esc(data.error || 'Erro ao restaurar.')}</div>`;
        }
    } catch (e) {
        $('#try-sql').innerHTML = `<div class="err-text">${esc(backendMsg(e))}</div>`;
    }
}

$('#try-editor').addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const t = e.target, s = t.selectionStart;
        t.value = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd);
        t.selectionStart = t.selectionEnd = s + 2;
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        runTry();
    }
});

/* =====================================================
   Conta (login / cadastro com MySQL)
   ===================================================== */
function openAuth() { $('#auth-modal').classList.remove('hidden'); $('#log-email').focus(); }
function closeAuth() { $('#auth-modal').classList.add('hidden'); }

function authTab(t) {
    $('#form-login').classList.toggle('hidden', t !== 'login');
    $('#form-reg').classList.toggle('hidden', t !== 'reg');
    $('#tab-login').classList.toggle('on', t === 'login');
    $('#tab-reg').classList.toggle('on', t === 'reg');
    showStatus('', '');
}

function showStatus(msg, type) {
    const el = $('#auth-status');
    el.className = 'status ' + (type || '');
    el.textContent = msg;
}

let logEmpty = true;
function logSQL(sql, label) {
    const code = $('#sql-log code');
    if (logEmpty) { code.innerHTML = ''; logEmpty = false; }
    const hora = new Date().toLocaleTimeString('pt-BR');
    code.innerHTML += `<span class="meta">-- [${hora}] ${esc(label)}</span>${highlight(sql, 'sql')}\n`;
    $('#sql-log').scrollTop = $('#sql-log').scrollHeight;
}

function clearLog() {
    $('#sql-log code').textContent = 'Nenhum comando executado ainda…';
    logEmpty = true;
}

function renderUserArea() {
    $('#user-area').innerHTML = state.user
        ? `<span class="user-name">Olá, ${esc(state.user.nome)}</span><button class="btn ghost small" onclick="logout()">Sair</button>`
        : '<button class="btn small" onclick="openAuth()">Entrar</button>';
}

async function doRegister() {
    const nome = $('#reg-nome').value.trim();
    const email = $('#reg-email').value.trim().toLowerCase();
    const senha = $('#reg-senha').value;
    try {
        const { status, data } = await api('register', { nome, email, senha });
        if (data.sql) logSQL(data.sql, 'Cadastro');
        if (status === 200 && data.ok) {
            showStatus(data.message, 'ok');
            $('#log-email').value = email;
            $('#reg-nome').value = $('#reg-email').value = $('#reg-senha').value = '';
            setTimeout(() => authTab('login'), 900);
        } else {
            showStatus(data.error || 'Erro ao cadastrar.', 'err');
        }
    } catch (e) { showStatus(backendMsg(e), 'err'); }
}

async function doLogin() {
    const email = $('#log-email').value.trim().toLowerCase();
    const senha = $('#log-senha').value;
    try {
        const { status, data } = await api('login', { email, senha });
        if (data.sql) logSQL(data.sql, 'Login');
        if (status === 200 && data.ok) {
            state.user = data.user;
            showStatus(data.message, 'ok');
            $('#log-senha').value = '';
            renderUserArea();
            await syncProgress();
            setTimeout(closeAuth, 1000);
        } else {
            showStatus(data.error || 'Erro ao fazer login.', 'err');
        }
    } catch (e) { showStatus(backendMsg(e), 'err'); }
}

async function logout() {
    try { await api('logout', {}); } catch (e) {}
    state.user = null;
    renderUserArea();
    toast('Você saiu da conta.');
}

/* =====================================================
   Atalhos e inicialização
   ===================================================== */
document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); $('#search-input').focus(); }
    if (e.key === 'Escape') {
        if (!$('#try-modal').classList.contains('hidden')) closeTry();
        if (!$('#auth-modal').classList.contains('hidden')) closeAuth();
    }
});

window.addEventListener('hashchange', route);

async function init() {
    applyTheme(store.get('w3pro_theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    renderUserArea();
    route();

    try {
        const me = await api('me');
        if (me.data && me.data.user) {
            state.user = me.data.user;
            renderUserArea();
            syncProgress();
        }
    } catch (e) { /* sem backend: o site funciona, só login e MySQL ficam indisponíveis */ }
}

init();
