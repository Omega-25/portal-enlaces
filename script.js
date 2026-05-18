// ========== CONFIGURACIÓN SUPABASE ==========
const SUPABASE_URL = 'https://hxdexehhsrrwjnjmhbxa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Ai_NyPeY_s04W25RUfq26w_BHCqHtGJ';
const emojiList = ['🔍', '🌐', '📱', '💻', '⚙️', '🔧', '🛠️', '📝', '📄', '📋', '📊', '📈', '📉', '💼', '🎯', '🎨', '🎭', '🎪', '🎬', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '📻', '📺', '📹', '📷', '🎥', '🔬', '🔭', '⚗️', '🧪', '🧬', '⚛️', '🧲', '🔋', '💡'];

const defaultButtons = [
    { name: 'Google', url: 'https://www.google.com', color: '#5b9cde', icon: '🔍' },
    { name: 'GitHub', url: 'https://github.com', color: '#b896ff', icon: '🐙' },
    { name: 'YouTube', url: 'https://www.youtube.com', color: '#ff6b6b', icon: '▶️' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', color: '#4dd0e1', icon: '📚' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: '#ffb347', icon: '💻' },
    { name: 'Discord', url: 'https://discord.com', color: '#5b9cde', icon: '💬' }
];

let isMaximized = false;
let isDragging = false;
let offset = { x: 0, y: 0 };
let isLoggedIn = false;
let currentUser = null;

// ========== VALIDACIÓN ==========
function validateUsername(u) { return u.length >= 3 && /^[a-zA-Z0-9_]+$/.test(u); }
function validatePassword(p) { return p.length >= 6; }

// ========== USUARIOS ==========
function handleLogin() {
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value;
    const msg = document.getElementById('loginMessage');

    if (!u || !p) { msg.textContent = 'Completa todos los campos'; return; }

    let users = JSON.parse(localStorage.getItem('portalUsers') || '[]');
    const user = users.find(x => x.username === u && x.password === btoa(p));

    if (user) {
        isLoggedIn = true;
        currentUser = u;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'flex';
        loadPortal();
    } else {
        msg.textContent = 'Usuario o contraseña incorrectos';
    }
}

function handleRegister() {
    const u = document.getElementById('registerUsername').value.trim();
    const e = document.getElementById('registerEmail').value.trim();
    const p = document.getElementById('registerPassword').value;
    const c = document.getElementById('registerConfirmPassword').value;
    const msg = document.getElementById('registerMessage');

    if (!validateUsername(u)) { msg.textContent = 'Usuario inválido (3+ caracteres, alfanumérico)'; return; }
    if (!validatePassword(p)) { msg.textContent = 'Contraseña mínimo 6 caracteres'; return; }
    if (p !== c) { msg.textContent = 'Contraseñas no coinciden'; return; }

    let users = JSON.parse(localStorage.getItem('portalUsers') || '[]');
    if (users.find(x => x.username === u)) { msg.textContent = 'Usuario ya existe'; return; }

    users.push({ username: u, email: e, password: btoa(p) });
    localStorage.setItem('portalUsers', JSON.stringify(users));
    
    msg.textContent = '';
    alert('¡Registrado! Ahora inicia sesión');
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// ========== PORTAL ==========
function loadPortal() {
    const buttons = JSON.parse(localStorage.getItem('portalButtons') || JSON.stringify(defaultButtons));
    renderButtons(buttons);
    setupColorPicker();
    setupOpacityControl();
    setupEvents();
}

function renderButtons(buttons) {
    const grid = document.getElementById('buttonsGrid');
    grid.innerHTML = '';

    buttons.forEach((btn, idx) => {
        const b = document.createElement('button');
        b.className = 'link-button custom';
        b.style.background = btn.color;
        
        const brightness = (parseInt(btn.color.substr(1, 2), 16) * 299 + parseInt(btn.color.substr(3, 2), 16) * 587 + parseInt(btn.color.substr(5, 2), 16) * 114) / 1000;
        b.style.color = brightness > 128 ? '#000' : '#fff';
        
        b.innerHTML = `<span class="button-icon">${btn.icon}</span><span class="button-text">${btn.name}</span>`;
        b.onclick = () => window.open(btn.url, '_blank');
        b.oncontextmenu = (e) => {
            e.preventDefault();
            if (confirm(`¿Eliminar ${btn.name}?`)) {
                buttons.splice(idx, 1);
                localStorage.setItem('portalButtons', JSON.stringify(buttons));
                renderButtons(buttons);
            }
        };
        grid.appendChild(b);
    });

    document.getElementById('syncStatus').textContent = '✅ Sincronizado';
}

function addButton() {
    const n = document.getElementById('btnName').value.trim();
    const u = document.getElementById('btnUrl').value.trim();
    const e = document.getElementById('btnEmoji').value.trim() || '🔗';
    const c = document.getElementById('btnColorHex').value.trim();

    if (!n || !u) { alert('Completa los campos'); return; }
    if (!u.startsWith('http')) { alert('URL debe empezar con http'); return; }
    if (!/^#[0-9A-F]{6}$/i.test(c)) { alert('Color inválido'); return; }

    let buttons = JSON.parse(localStorage.getItem('portalButtons') || JSON.stringify(defaultButtons));
    buttons.push({ name: n, url: u, color: c.toUpperCase(), icon: e });
    localStorage.setItem('portalButtons', JSON.stringify(buttons));

    document.getElementById('btnName').value = '';
    document.getElementById('btnUrl').value = '';
    document.getElementById('btnEmoji').value = '🔗';
    document.getElementById('btnColorPicker').value = '#5b9cde';
    document.getElementById('btnColorHex').value = '#5b9cde';
    
    document.getElementById('addSection').style.display = 'none';
    document.getElementById('expandAddBtn').style.display = 'block';
    
    renderButtons(buttons);
    alert('¡Botón agregado!');
}

function setupColorPicker() {
    const cp = document.getElementById('btnColorPicker');
    const ch = document.getElementById('btnColorHex');
    const prev = document.getElementById('colorPreview');

    cp.addEventListener('input', (e) => {
        const hex = e.target.value;
        ch.value = hex;
        prev.style.background = hex;
    });

    ch.addEventListener('input', (e) => {
        const hex = e.target.value.trim();
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            cp.value = hex;
            prev.style.background = hex;
        }
    });

    prev.addEventListener('click', () => cp.click());
}

function setupOpacityControl() {
    const slider = document.getElementById('opacitySlider');
    const value = document.getElementById('opacityValue');
    const container = document.getElementById('windowContainer');

    const saved = localStorage.getItem('windowOpacity') || 95;
    slider.value = saved;
    container.style.opacity = saved / 100;
    value.textContent = saved + '%';

    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        container.style.opacity = val / 100;
        value.textContent = val + '%';
        localStorage.setItem('windowOpacity', val);
    });
}

function setupEmojiModal() {
    const modal = document.getElementById('emojiModal');
    const grid = document.getElementById('emojiGrid');
    grid.innerHTML = '';
    
    emojiList.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-item';
        btn.textContent = emoji;
        btn.onclick = (e) => {
            e.preventDefault();
            document.getElementById('btnEmoji').value = emoji;
            modal.style.display = 'none';
        };
        grid.appendChild(btn);
    });
}

function setupEvents() {
    document.getElementById('expandAddBtn').onclick = () => {
        const sec = document.getElementById('addSection');
        sec.style.display = sec.style.display === 'none' ? 'block' : 'none';
    };

    document.getElementById('addBtn').onclick = addButton;
    document.getElementById('cancelBtn').onclick = () => {
        document.getElementById('addSection').style.display = 'none';
    };

    document.getElementById('emojiSelectorBtn').onclick = () => {
        const modal = document.getElementById('emojiModal');
        if (modal.style.display === 'none') {
            setupEmojiModal();
            modal.style.display = 'block';
        } else {
            modal.style.display = 'none';
        }
    };

    document.getElementById('minBtn').onclick = () => {
        const content = document.getElementById('windowContent');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    };

    document.getElementById('maxBtn').onclick = () => {
        const container = document.getElementById('windowContainer');
        isMaximized = !isMaximized;
        if (isMaximized) {
            container.style.position = 'fixed';
            container.style.width = '90vw';
            container.style.height = '85vh';
        } else {
            container.style.position = 'relative';
            container.style.width = '600px';
            container.style.height = 'auto';
        }
    };

    document.getElementById('closeBtn').onclick = () => {
        document.getElementById('windowContainer').style.display = 'none';
        document.getElementById('floatingIcon').style.display = 'flex';
    };

    document.getElementById('logoutBtn').onclick = () => {
        if (confirm('¿Cerrar sesión?')) {
            isLoggedIn = false;
            document.getElementById('mainScreen').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
        }
    };

    document.getElementById('floatingIcon').onclick = () => {
        document.getElementById('windowContainer').style.display = 'block';
        document.getElementById('floatingIcon').style.display = 'none';
    };

    const titleBar = document.getElementById('titleBar');
    const container = document.getElementById('windowContainer');
    titleBar.addEventListener('mousedown', (e) => {
        if (isMaximized) return;
        isDragging = true;
        const rect = container.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && !isMaximized) {
            container.style.position = 'fixed';
            container.style.left = (e.clientX - offset.x) + 'px';
            container.style.top = (e.clientY - offset.y) + 'px';
        }
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').onclick = handleLogin;
    document.getElementById('registerBtn').onclick = handleRegister;
    document.getElementById('registerToggleBtn').onclick = () => {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    };
    document.getElementById('loginBackBtn').onclick = () => {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    };

    document.getElementById('loginUsername').focus();
});
