// ========== CONFIGURACIÓN SUPABASE ==========
// REEMPLAZA CON TUS DATOS DE SUPABASE
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

let supabase = null;

// Inicializar Supabase
function initSupabase() {
    if (window.supabase && window.supabase.createClient) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

// Credenciales correctas
const VALID_USERS = [
    { username: 'omega25', password: 'gatoputo' },
    { username: 'admin', password: '1234' },
    { username: 'usuario2', password: 'contraseña2' }
];

// Lista de emojis disponibles
const emojiList = [
    '🔍', '🌐', '📱', '💻', '⚙️', '🔧', '🛠️', '📝', '📄', '📋',
    '📊', '📈', '📉', '💼', '🎯', '🎨', '🎭', '🎪', '🎬', '🎸',
    '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '📻', '📺', '📹', '📷',
    '🎥', '🔬', '🔭', '⚗️', '🧪', '🧬', '⚛️', '🧲', '🔋', '💡',
    '🕯️', '🪔', '💎', '📚', '📖', '📕', '📗', '📘', '📙', '📓',
    '📔', '📒', '📰', '🗞️', '📑', '🧾', '✏️', '✒️', '🖋️', '🖊️',
    '🖌️', '🖍️', '🗂️', '🗃️', '🗳️', '🗄️', '📅', '📆', '🗒️', '🗓️',
    '📇', '📈', '📉', '📊', '📋', '📁', '📂', '🗂️', '🗞️', '📰',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔',
    '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴',
    '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🐢',
    '🐍', '🐙', '🦑', '🦐', '🦞', '🦟', '🦠', '🐡', '🐠', '🐟',
    '🌍', '🌎', '🌏', '🌐', '⭐', '🌟', '✨', '⚡', '☄️', '💥',
    '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️',
    '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦',
    '☔', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
    '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥑', '🍅', '🍆', '🥑',
    '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍞',
    '🥐', '🥯', '🍖', '🍗', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙',
    '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛',
    '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠',
    '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🧁', '🍮',
    '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🍯', '🥛', '🍼',
    '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❤️‍🔥', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '👋'
];

// Datos de botones por defecto
const defaultButtons = [
    { name: 'Google', url: 'https://www.google.com', color: '#5b9cde', icon: '🔍' },
    { name: 'GitHub', url: 'https://github.com', color: '#b896ff', icon: '🐙' },
    { name: 'YouTube', url: 'https://www.youtube.com', color: '#ff6b6b', icon: '▶️' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', color: '#4dd0e1', icon: '📚' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: '#ffb347', icon: '💻' },
    { name: 'Discord', url: 'https://discord.com', color: '#5b9cde', icon: '💬' }
];

// Estado
let isMaximized = false;
let isDragging = false;
let offset = { x: 0, y: 0 };
let isLoggedIn = false;
let currentUser = null;

// ========== FUNCIONES DE SINCRONIZACIÓN ==========
function updateSyncStatus(message, type = 'success') {
    const status = document.getElementById('syncStatus');
    status.textContent = message;
    status.className = 'sync-status';
    if (type === 'error') status.classList.add('error');
    if (type === 'syncing') status.classList.add('syncing');
}

async function loadButtonsFromSupabase() {
    try {
        if (!supabase) return defaultButtons;

        updateSyncStatus('🔄 Sincronizando...', 'syncing');

        const { data, error } = await supabase
            .from('buttons')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            updateSyncStatus('✅ Sincronizado');
            return data.map(btn => ({
                id: btn.id,
                name: btn.name,
                url: btn.url,
                color: btn.color,
                icon: btn.icon
            }));
        }

        updateSyncStatus('✅ Sincronizado');
        return defaultButtons;
    } catch (error) {
        console.error('Error al cargar desde Supabase:', error);
        updateSyncStatus('⚠️ Usando datos locales', 'error');
        return JSON.parse(localStorage.getItem('portalButtons')) || defaultButtons;
    }
}

async function saveButtonToSupabase(button) {
    try {
        if (!supabase) {
            localStorage.setItem('portalButtons', JSON.stringify([button]));
            return;
        }

        updateSyncStatus('🔄 Guardando...', 'syncing');

        const { data, error } = await supabase
            .from('buttons')
            .insert([{
                name: button.name,
                url: button.url,
                color: button.color,
                icon: button.icon
            }])
            .select();

        if (error) throw error;

        updateSyncStatus('✅ Guardado');
        return data[0];
    } catch (error) {
        console.error('Error al guardar:', error);
        updateSyncStatus('❌ Error al guardar', 'error');
    }
}

async function deleteButtonFromSupabase(buttonId) {
    try {
        if (!supabase) return;

        updateSyncStatus('🔄 Eliminando...', 'syncing');

        const { error } = await supabase
            .from('buttons')
            .delete()
            .eq('id', buttonId);

        if (error) throw error;

        updateSyncStatus('✅ Eliminado');
    } catch (error) {
        console.error('Error al eliminar:', error);
        updateSyncStatus('❌ Error al eliminar', 'error');
    }
}

// ========== FUNCIONES DE AUTENTICACIÓN ==========
function validateLogin(username, password) {
    return VALID_USERS.find(user => user.username === username && user.password === password);
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    if (!username) {
        message.textContent = 'Por favor ingresa el usuario';
        return;
    }

    if (!password) {
        message.textContent = 'Por favor ingresa la contraseña';
        return;
    }

    const validUser = validateLogin(username, password);
    
    if (validUser) {
        isLoggedIn = true;
        currentUser = validUser.username;
        message.textContent = '';
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'flex';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        initializeMainScreen();
    } else {
        message.textContent = 'Usuario o contraseña incorrectos';
        document.getElementById('loginPassword').value = '';
    }
}

function handleLogout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        isLoggedIn = false;
        currentUser = null;
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginUsername').focus();
    }
}

// ========== FUNCIONES PRINCIPALES ==========
function getBrightness(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

function renderButtons(buttons) {
    const grid = document.getElementById('buttonsGrid');
    grid.innerHTML = '';

    buttons.forEach((btn, index) => {
        const button = document.createElement('button');
        button.className = `link-button custom`;
        button.style.background = btn.color;
        
        const brightness = getBrightness(btn.color);
        button.style.color = brightness > 128 ? '#000000' : '#ffffff';
        
        button.innerHTML = `
            <span class="button-icon">${btn.icon || '🔗'}</span>
            <span class="button-text">${btn.name}</span>
        `;

        button.addEventListener('click', () => {
            window.open(btn.url, '_blank');
        });

        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`¿Eliminar "${btn.name}"?`)) {
                if (btn.id) {
                    deleteButtonFromSupabase(btn.id);
                }
                buttons.splice(index, 1);
                renderButtons(buttons);
            }
        });

        grid.appendChild(button);
    });
}

function toggleAddSection() {
    const addSection = document.getElementById('addSection');
    const expandBtn = document.getElementById('expandAddBtn');
    
    if (addSection.style.display === 'none' || addSection.style.display === '') {
        addSection.style.display = 'block';
        expandBtn.style.display = 'none';
        document.getElementById('btnName').focus();
    } else {
        addSection.style.display = 'none';
        expandBtn.style.display = 'block';
        closeEmojiModal();
    }
}

function toggleEmojiModal() {
    const emojiModal = document.getElementById('emojiModal');
    if (emojiModal.style.display === 'none' || emojiModal.style.display === '') {
        populateEmojiGrid();
        emojiModal.style.display = 'block';
    } else {
        emojiModal.style.display = 'none';
    }
}

function closeEmojiModal() {
    const emojiModal = document.getElementById('emojiModal');
    emojiModal.style.display = 'none';
}

function populateEmojiGrid() {
    const emojiGrid = document.getElementById('emojiGrid');
    emojiGrid.innerHTML = '';

    emojiList.forEach(emoji => {
        const emojiItem = document.createElement('button');
        emojiItem.className = 'emoji-item';
        emojiItem.innerHTML = emoji;
        emojiItem.type = 'button';
        
        emojiItem.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('btnEmoji').value = emoji;
            closeEmojiModal();
        });

        emojiGrid.appendChild(emojiItem);
    });
}

function setupColorPicker() {
    const colorPicker = document.getElementById('btnColorPicker');
    const colorHex = document.getElementById('btnColorHex');
    const colorPreview = document.getElementById('colorPreview');

    colorPicker.addEventListener('input', (e) => {
        const hexColor = e.target.value;
        colorHex.value = hexColor;
        colorPreview.style.background = hexColor;
    });

    colorHex.addEventListener('input', (e) => {
        let hexColor = e.target.value.trim();
        
        if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
            colorPicker.value = hexColor;
            colorPreview.style.background = hexColor;
        } else if (hexColor === '') {
            colorPreview.style.background = '#5b9cde';
        }
    });

    colorPreview.addEventListener('click', () => {
        colorPicker.click();
    });
}

async function addButton() {
    const name = document.getElementById('btnName').value.trim();
    const url = document.getElementById('btnUrl').value.trim();
    const emoji = document.getElementById('btnEmoji').value.trim();
    let color = document.getElementById('btnColorHex').value.trim();

    if (!name || !url) {
        alert('Por favor completa todos los campos');
        return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('La URL debe comenzar con http:// o https://');
        return;
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
        alert('Por favor ingresa un color hexadecimal válido (ej: #5b9cde)');
        return;
    }

    const newButton = {
        name: name,
        url: url,
        color: color.toUpperCase(),
        icon: emoji || '🔗'
    };

    await saveButtonToSupabase(newButton);

    document.getElementById('btnName').value = '';
    document.getElementById('btnUrl').value = '';
    document.getElementById('btnEmoji').value = '🔗';
    document.getElementById('btnColorPicker').value = '#5b9cde';
    document.getElementById('btnColorHex').value = '#5b9cde';
    document.getElementById('colorPreview').style.background = '#5b9cde';

    toggleAddSection();
    
    // Recargar botones
    const buttons = await loadButtonsFromSupabase();
    renderButtons(buttons);
    
    alert('¡Botón agregado correctamente!');
}

function minimizeWindow() {
    const content = document.getElementById('windowContent');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

function maximizeWindow() {
    const container = document.querySelector('.window-container');
    const titleBar = document.getElementById('titleBar');
    
    isMaximized = !isMaximized;
    
    if (isMaximized) {
        container.classList.add('maximized');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.width = '90vw';
        container.style.maxWidth = '90vw';
        container.style.height = '85vh';
        container.style.cursor = 'default';
        titleBar.style.cursor = 'default';
    } else {
        container.classList.remove('maximized');
        container.style.position = 'absolute';
        container.style.top = '';
        container.style.left = '';
        container.style.transform = '';
        container.style.width = '600px';
        container.style.maxWidth = '90vw';
        container.style.height = 'auto';
        container.style.cursor = 'move';
        titleBar.style.cursor = 'move';
    }
}

function closeWindow() {
    const windowContainer = document.querySelector('.window-container');
    const floatingIcon = document.getElementById('floatingIcon');
    
    windowContainer.style.display = 'none';
    floatingIcon.style.display = 'flex';
}

function openWindow() {
    const windowContainer = document.querySelector('.window-container');
    const floatingIcon = document.getElementById('floatingIcon');
    
    windowContainer.style.display = 'block';
    floatingIcon.style.display = 'none';
}

async function initializeMainScreen() {
    const buttons = await loadButtonsFromSupabase();
    renderButtons(buttons);
    
    setupColorPicker();

    const titleBar = document.getElementById('titleBar');
    const windowContainer = document.querySelector('.window-container');
    const minBtn = document.getElementById('minBtn');
    const maxBtn = document.getElementById('maxBtn');
    const closeBtn = document.getElementById('closeBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const expandAddBtn = document.getElementById('expandAddBtn');
    const addBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const emojiSelectorBtn = document.getElementById('emojiSelectorBtn');
    const emojiModal = document.getElementById('emojiModal');
    const addSection = document.getElementById('addSection');
    const floatingIcon = document.getElementById('floatingIcon');

    minBtn.onclick = null;
    maxBtn.onclick = null;
    closeBtn.onclick = null;
    logoutBtn.onclick = null;

    minBtn.addEventListener('click', minimizeWindow);
    maxBtn.addEventListener('click', maximizeWindow);
    closeBtn.addEventListener('click', closeWindow);
    logoutBtn.addEventListener('click', handleLogout);

    expandAddBtn.addEventListener('click', toggleAddSection);
    addBtn.addEventListener('click', addButton);
    cancelBtn.addEventListener('click', toggleAddSection);

    emojiSelectorBtn.addEventListener('click', toggleEmojiModal);

    floatingIcon.addEventListener('click', openWindow);

    document.addEventListener('click', (e) => {
        if (!addSection.contains(e.target) && emojiModal.style.display === 'block') {
            closeEmojiModal();
        }
    });

    titleBar.addEventListener('mousedown', (e) => {
        if (isMaximized) return;
        
        isDragging = true;
        const rect = windowContainer.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && !isMaximized) {
            windowContainer.style.position = 'fixed';
            windowContainer.style.left = (e.clientX - offset.x) + 'px';
            windowContainer.style.top = (e.clientY - offset.y) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Supabase
    initSupabase();

    // Setup login
    const loginBtn = document.getElementById('loginBtn');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    loginBtn.addEventListener('click', handleLogin);
    
    loginUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginPassword.focus();
    });
    
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    loginUsername.focus();
});