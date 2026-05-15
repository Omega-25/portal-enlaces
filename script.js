// ========== CONFIGURACIÓN SUPABASE ==========
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

let supabaseClient = null;

// Inicializar Supabase
function initSupabase() {
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase inicializado correctamente');
        }
    } catch (error) {
        console.error('Error inicializando Supabase:', error);
    }
}

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
let currentButtons = [];

// ========== FUNCIONES DE VALIDACIÓN ==========

// Validar contraseña (requisitos mínimos)
function validatePassword(password) {
    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
}

// Validar usuario
function validateUsername(username) {
    if (username.length < 3) {
        return 'El usuario debe tener al menos 3 caracteres';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'El usuario solo puede contener letras, números y guiones bajos';
    }
    return null;
}

// ========== FUNCIONES DE USUARIOS ==========

// Registrar nuevo usuario
async function registerUser(username, password, email = '') {
    try {
        console.log('Registrando usuario:', username);

        // Validar
        const usernameError = validateUsername(username);
        if (usernameError) {
            alert(usernameError);
            return false;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            alert(passwordError);
            return false;
        }

        if (!supabaseClient) {
            console.log('Supabase no disponible, guardando en localStorage');
            
            // Guardar en localStorage como respaldo
            let users = JSON.parse(localStorage.getItem('portalUsers') || '[]');
            
            // Verificar si el usuario ya existe
            if (users.find(u => u.username === username)) {
                alert('Este usuario ya existe');
                return false;
            }
            
            users.push({
                username: username,
                password: btoa(password),
                email: email
            });
            
            localStorage.setItem('portalUsers', JSON.stringify(users));
            alert('¡Usuario registrado correctamente! Ahora puedes iniciar sesión.');
            return true;
        }

        // Verificar si el usuario ya existe
        const { data: existingUser, error: checkError } = await supabaseClient
            .from('users')
            .select('id')
            .eq('username', username)
            .single();

        if (existingUser) {
            alert('Este usuario ya existe');
            return false;
        }

        // Crear usuario
        const { data, error } = await supabaseClient
            .from('users')
            .insert([{
                username: username,
                password: btoa(password),
                email: email
            }])
            .select();

        if (error) {
            console.error('Error al registrar:', error);
            alert('Error al registrar el usuario. Intenta más tarde.');
            return false;
        }

        console.log('Usuario registrado:', data);
        alert('¡Usuario registrado correctamente! Ahora puedes iniciar sesión.');
        return true;

    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el usuario');
        return false;
    }
}

// Validar usuario desde Supabase
async function validateLoginFromSupabase(username, password) {
    try {
        console.log('Validando login para:', username);

        // Si Supabase no está disponible, usa localStorage
        if (!supabaseClient) {
            console.log('Supabase no disponible, usando localStorage');
            
            const users = JSON.parse(localStorage.getItem('portalUsers') || '[]');
            const user = users.find(u => u.username === username);
            
            if (!user) {
                console.log('Usuario no encontrado en localStorage');
                return null;
            }

            const encodedPassword = btoa(password);
            if (user.password === encodedPassword) {
                return {
                    username: user.username,
                    email: user.email || ''
                };
            }

            return null;
        }

        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) {
            console.log('Usuario no encontrado');
            return null;
        }

        // Comparar contraseña
        const encodedPassword = btoa(password);
        if (data.password === encodedPassword) {
            return {
                id: data.id,
                username: data.username,
                email: data.email || ''
            };
        }

        return null;

    } catch (error) {
        console.error('Error validando usuario:', error);
        return null;
    }
}

// ========== FUNCIONES DE AUTENTICACIÓN ==========

function handleLogin() {
    const username = document.getElementById('loginUsername');
    const password = document.getElementById('loginPassword');
    const message = document.getElementById('loginMessage');

    if (!username || !password || !message) {
        console.error('Faltan elementos del formulario de login');
        return;
    }

    const usernameValue = username.value.trim();
    const passwordValue = password.value;

    console.log('Intento de login:', usernameValue);

    if (!usernameValue) {
        message.textContent = 'Por favor ingresa el usuario';
        return;
    }

    if (!passwordValue) {
        message.textContent = 'Por favor ingresa la contraseña';
        return;
    }

    // Validar desde Supabase
    validateLoginFromSupabase(usernameValue, passwordValue).then(validUser => {
        if (validUser) {
            console.log('Login exitoso para:', usernameValue);
            isLoggedIn = true;
            currentUser = validUser.username;
            message.textContent = '';
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainScreen').style.display = 'flex';
            username.value = '';
            password.value = '';
            initializeMainScreen();
        } else {
            console.log('Login fallido');
            message.textContent = 'Usuario o contraseña incorrectos';
            password.value = '';
        }
    });
}

function toggleRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (!loginForm || !registerForm) {
        console.error('Faltan formularios');
        return;
    }

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        const usernameInput = document.getElementById('loginUsername');
        if (usernameInput) usernameInput.focus();
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        const registerUsernameInput = document.getElementById('registerUsername');
        if (registerUsernameInput) registerUsernameInput.focus();
    }

    document.getElementById('loginMessage').textContent = '';
    document.getElementById('registerMessage').textContent = '';
}

async function handleRegister() {
    const username = document.getElementById('registerUsername');
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('registerConfirmPassword');
    const email = document.getElementById('registerEmail');
    const message = document.getElementById('registerMessage');

    // Verificar que los elementos existen
    if (!username || !password || !confirmPassword || !email || !message) {
        console.error('Faltan elementos del formulario de registro');
        return;
    }

    const usernameValue = username.value.trim();
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;
    const emailValue = email.value.trim();

    // Limpiar mensaje anterior
    message.textContent = '';
    message.style.color = '#c41e3a';

    if (!usernameValue || !passwordValue || !confirmPasswordValue) {
        message.textContent = 'Por favor completa todos los campos';
        return;
    }

    if (passwordValue !== confirmPasswordValue) {
        message.textContent = 'Las contraseñas no coinciden';
        return;
    }

    // Llamar a la función de registro
    const success = await registerUser(usernameValue, passwordValue, emailValue);
    
    if (success) {
        // Limpiar campos
        username.value = '';
        password.value = '';
        confirmPassword.value = '';
        email.value = '';
        
        // Cambiar a login
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        const loginUsernameInput = document.getElementById('loginUsername');
        if (loginUsernameInput) loginUsernameInput.focus();
        
        message.textContent = '';
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

// ========== FUNCIONES DE SINCRONIZACIÓN ==========
function updateSyncStatus(message, type = 'success') {
    const status = document.getElementById('syncStatus');
    if (status) {
        status.textContent = message;
        status.className = 'sync-status';
        if (type === 'error') status.classList.add('error');
        if (type === 'syncing') status.classList.add('syncing');
    }
}

async function loadButtonsFromSupabase() {
    try {
        if (!supabaseClient) {
            console.log('Supabase no inicializado, usando localStorage');
            const saved = localStorage.getItem('portalButtons');
            return saved ? JSON.parse(saved) : defaultButtons;
        }

        updateSyncStatus('🔄 Sincronizando...', 'syncing');

        const { data, error } = await supabaseClient
            .from('buttons')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error Supabase:', error);
            throw error;
        }

        if (data && data.length > 0) {
            console.log('Botones cargados desde Supabase:', data);
            updateSyncStatus('✅ Sincronizado');
            currentButtons = data;
            localStorage.setItem('portalButtons', JSON.stringify(data));
            return data;
        }

        updateSyncStatus('✅ Sincronizado');
        currentButtons = defaultButtons;
        return defaultButtons;
    } catch (error) {
        console.error('Error al cargar desde Supabase:', error);
        updateSyncStatus('⚠️ Usando datos locales', 'error');
        const saved = localStorage.getItem('portalButtons');
        const buttons = saved ? JSON.parse(saved) : defaultButtons;
        currentButtons = buttons;
        return buttons;
    }
}

async function saveButtonToSupabase(button) {
    try {
        if (!supabaseClient) {
            console.log('Guardando en localStorage');
            const saved = localStorage.getItem('portalButtons') || '[]';
            const buttons = JSON.parse(saved);
            buttons.push(button);
            localStorage.setItem('portalButtons', JSON.stringify(buttons));
            return button;
        }

        updateSyncStatus('🔄 Guardando...', 'syncing');

        const { data, error } = await supabaseClient
            .from('buttons')
            .insert([{
                name: button.name,
                url: button.url,
                color: button.color,
                icon: button.icon
            }])
            .select();

        if (error) throw error;

        console.log('Botón guardado:', data);
        updateSyncStatus('✅ Guardado');
        return data[0];
    } catch (error) {
        console.error('Error al guardar:', error);
        updateSyncStatus('❌ Error al guardar', 'error');
        
        const saved = localStorage.getItem('portalButtons') || '[]';
        const buttons = JSON.parse(saved);
        buttons.push(button);
        localStorage.setItem('portalButtons', JSON.stringify(buttons));
    }
}

async function deleteButtonFromSupabase(buttonId) {
    try {
        if (!supabaseClient) {
            console.log('Eliminando de localStorage');
            return;
        }

        updateSyncStatus('🔄 Eliminando...', 'syncing');

        const { error } = await supabaseClient
            .from('buttons')
            .delete()
            .eq('id', buttonId);

        if (error) throw error;

        console.log('Botón eliminado');
        updateSyncStatus('✅ Eliminado');
    } catch (error) {
        console.error('Error al eliminar:', error);
        updateSyncStatus('❌ Error al eliminar', 'error');
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
    if (!grid) return;
    
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
                currentButtons = buttons;
                renderButtons(buttons);
            }
        });

        grid.appendChild(button);
    });
}

function toggleAddSection() {
    const addSection = document.getElementById('addSection');
    const expandBtn = document.getElementById('expandAddBtn');
    
    if (!addSection || !expandBtn) return;
    
    if (addSection.style.display === 'none' || addSection.style.display === '') {
        addSection.style.display = 'block';
        expandBtn.style.display = 'none';
        const nameInput = document.getElementById('btnName');
        if (nameInput) nameInput.focus();
    } else {
        addSection.style.display = 'none';
        expandBtn.style.display = 'block';
        closeEmojiModal();
    }
}

function toggleEmojiModal() {
    const emojiModal = document.getElementById('emojiModal');
    if (!emojiModal) return;
    
    if (emojiModal.style.display === 'none' || emojiModal.style.display === '') {
        populateEmojiGrid();
        emojiModal.style.display = 'block';
    } else {
        emojiModal.style.display = 'none';
    }
}

function closeEmojiModal() {
    const emojiModal = document.getElementById('emojiModal');
    if (emojiModal) emojiModal.style.display = 'none';
}

function populateEmojiGrid() {
    const emojiGrid = document.getElementById('emojiGrid');
    if (!emojiGrid) return;
    
    emojiGrid.innerHTML = '';

    emojiList.forEach(emoji => {
        const emojiItem = document.createElement('button');
        emojiItem.className = 'emoji-item';
        emojiItem.innerHTML = emoji;
        emojiItem.type = 'button';
        
        emojiItem.addEventListener('click', (e) => {
            e.preventDefault();
            const emojiInput = document.getElementById('btnEmoji');
            if (emojiInput) emojiInput.value = emoji;
            closeEmojiModal();
        });

        emojiGrid.appendChild(emojiItem);
    });
}

function setupColorPicker() {
    const colorPicker = document.getElementById('btnColorPicker');
    const colorHex = document.getElementById('btnColorHex');
    const colorPreview = document.getElementById('colorPreview');

    if (!colorPicker || !colorHex || !colorPreview) return;

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
    const name = document.getElementById('btnName');
    const url = document.getElementById('btnUrl');
    const emoji = document.getElementById('btnEmoji');
    const color = document.getElementById('btnColorHex');

    if (!name || !url || !emoji || !color) {
        console.error('Faltan elementos del formulario de botón');
        return;
    }

    const nameValue = name.value.trim();
    const urlValue = url.value.trim();
    const emojiValue = emoji.value.trim();
    const colorValue = color.value.trim();

    if (!nameValue || !urlValue) {
        alert('Por favor completa todos los campos');
        return;
    }

    if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://')) {
        alert('La URL debe comenzar con http:// o https://');
        return;
    }

    if (!/^#[0-9A-F]{6}$/i.test(colorValue)) {
        alert('Por favor ingresa un color hexadecimal válido (ej: #5b9cde)');
        return;
    }

    const newButton = {
        name: nameValue,
        url: urlValue,
        color: colorValue.toUpperCase(),
        icon: emojiValue || '🔗'
    };

    await saveButtonToSupabase(newButton);

    name.value = '';
    url.value = '';
    emoji.value = '🔗';
    document.getElementById('btnColorPicker').value = '#5b9cde';
    color.value = '#5b9cde';
    document.getElementById('colorPreview').style.background = '#5b9cde';

    toggleAddSection();
    
    const buttons = await loadButtonsFromSupabase();
    renderButtons(buttons);
    
    alert('¡Botón agregado correctamente!');
}

function minimizeWindow() {
    const content = document.getElementById('windowContent');
    if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
}

function maximizeWindow() {
    const container = document.querySelector('.window-container');
    const titleBar = document.getElementById('titleBar');
    
    if (!container || !titleBar) return;
    
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
    
    if (windowContainer && floatingIcon) {
        windowContainer.style.display = 'none';
        floatingIcon.style.display = 'flex';
    }
}

function openWindow() {
    const windowContainer = document.querySelector('.window-container');
    const floatingIcon = document.getElementById('floatingIcon');
    
    if (windowContainer && floatingIcon) {
        windowContainer.style.display = 'block';
        floatingIcon.style.display = 'none';
    }
}

async function initializeMainScreen() {
    console.log('Inicializando pantalla principal para:', currentUser);
    
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

    if (minBtn) minBtn.onclick = null;
    if (maxBtn) maxBtn.onclick = null;
    if (closeBtn) closeBtn.onclick = null;
    if (logoutBtn) logoutBtn.onclick = null;

    if (minBtn) minBtn.addEventListener('click', minimizeWindow);
    if (maxBtn) maxBtn.addEventListener('click', maximizeWindow);
    if (closeBtn) closeBtn.addEventListener('click', closeWindow);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    if (expandAddBtn) expandAddBtn.addEventListener('click', toggleAddSection);
    if (addBtn) addBtn.addEventListener('click', addButton);
    if (cancelBtn) cancelBtn.addEventListener('click', toggleAddSection);

    if (emojiSelectorBtn) emojiSelectorBtn.addEventListener('click', toggleEmojiModal);

    if (floatingIcon) floatingIcon.addEventListener('click', openWindow);

    if (addSection && emojiModal) {
        document.addEventListener('click', (e) => {
            if (!addSection.contains(e.target) && emojiModal.style.display === 'block') {
                closeEmojiModal();
            }
        });
    }

    if (titleBar && windowContainer) {
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
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    
    initSupabase();

    // Setup login
    const loginBtn = document.getElementById('loginBtn');
    const registerToggleBtn = document.getElementById('registerToggleBtn');
    const loginBackBtn = document.getElementById('loginBackBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    console.log('Elementos encontrados:');
    console.log('loginBtn:', loginBtn);
    console.log('registerToggleBtn:', registerToggleBtn);
    console.log('loginBackBtn:', loginBackBtn);
    console.log('registerBtn:', registerBtn);

    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en botón de login');
            handleLogin();
        });
    }
    
    if (registerToggleBtn) {
        registerToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en botón toggle registro');
            toggleRegisterForm();
        });
    }
    
    if (loginBackBtn) {
        loginBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en botón volver');
            toggleRegisterForm();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en botón registrarse');
            handleRegister();
        });
    }
    
    if (loginUsername) {
        loginUsername.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (loginPassword) loginPassword.focus();
            }
        });
    }
    
    if (loginPassword) {
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    if (loginUsername) loginUsername.focus();
    
    console.log('Event listeners agregados');
});
