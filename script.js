// ========== CONFIGURACIÓN SUPABASE ==========
const SUPABASE_URL = 'https://hxdexehhsrrwjnjmhbxa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Ai_NyPeY_s04W25RUfq26w_BHCqHtGJ';

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
let isAdmin = false;
let currentUser = null;
let currentButtons = [];

// ========== FUNCIONES DE VALIDACIÓN ==========

function validatePassword(password) {
    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
}

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

async function registerUser(username, password, email = '') {
    try {
        console.log('Registrando usuario:', username);

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
            alert('Servidor no disponible. Intenta más tarde.');
            return false;
        }

        // Verificar si el usuario ya existe
        const { data: existingUser } = await supabaseClient
            .from('users')
            .select('id')
            .eq('username', username)
            .single();

        if (existingUser) {
            alert('Este usuario ya existe');
            return false;
        }

        // Verificar si hay solicitud pendiente
        const { data: existingRequest } = await supabaseClient
            .from('registration_requests')
            .select('id')
            .eq('username', username)
            .eq('status', 'pending')
            .single();

        if (existingRequest) {
            alert('Ya tiene una solicitud de registro pendiente');
            return false;
        }

        // Crear solicitud de registro en lugar de usuario directo
        const { data, error } = await supabaseClient
            .from('registration_requests')
            .insert([{
                username: username,
                email: email,
                status: 'pending'
            }])
            .select();

        if (error) {
            console.error('Error al registrar:', error);
            alert('Error al registrar. Intenta más tarde.');
            return false;
        }

        console.log('Solicitud de registro creada:', data);
        alert('¡Solicitud de registro enviada! Espera la aprobación del administrador.');
        return true;

    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar');
        return false;
    }
}

async function validateLoginFromSupabase(username, password) {
    try {
        console.log('Validando login para:', username);

        if (!supabaseClient) {
            const users = JSON.parse(localStorage.getItem('portalUsers') || '[]');
            const user = users.find(u => u.username === username);
            
            if (!user) return null;

            const encodedPassword = btoa(password);
            if (user.password === encodedPassword) {
                return {
                    username: user.username,
                    email: user.email || '',
                    approved: true
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

        // Verificar si el usuario está aprobado
        if (!data.approved) {
            alert('Tu cuenta no ha sido aprobada aún. Por favor, espera la aprobación del administrador.');
            return null;
        }

        const encodedPassword = btoa(password);
        if (data.password === encodedPassword) {
            return {
                id: data.id,
                username: data.username,
                email: data.email || '',
                approved: data.approved
            };
        }

        return null;

    } catch (error) {
        console.error('Error validando usuario:', error);
        return null;
    }
}

// Validar admin
async function validateAdmin(username, password) {
    try {
        console.log('Validando admin:', username);

        if (!supabaseClient) {
            const admins = JSON.parse(localStorage.getItem('admins') || '[]');
            const admin = admins.find(a => a.username === username);
            
            if (!admin) return null;

            const encodedPassword = btoa(password);
            if (admin.password === encodedPassword) {
                return {
                    username: admin.username,
                    email: admin.email || ''
                };
            }
            return null;
        }

        const { data, error } = await supabaseClient
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) {
            console.log('Admin no encontrado');
            return null;
        }

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
        console.error('Error validando admin:', error);
        return null;
    }
}

// ========== FUNCIONES DE AUTENTICACIÓN ==========

function handleLogin() {
    const username = document.getElementById('loginUsername');
    const password = document.getElementById('loginPassword');
    const message = document.getElementById('loginMessage');

    if (!username || !password || !message) return;

    const usernameValue = username.value.trim();
    const passwordValue = password.value;

    if (!usernameValue) {
        message.textContent = 'Por favor ingresa el usuario';
        return;
    }

    if (!passwordValue) {
        message.textContent = 'Por favor ingresa la contraseña';
        return;
    }

    validateLoginFromSupabase(usernameValue, passwordValue).then(validUser => {
        if (validUser) {
            console.log('Login exitoso para:', usernameValue);
            isLoggedIn = true;
            isAdmin = false;
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

function handleAdminLogin() {
    const username = document.getElementById('adminUsername');
    const password = document.getElementById('adminPassword');
    const message = document.getElementById('adminMessage');

    if (!username || !password || !message) return;

    const usernameValue = username.value.trim();
    const passwordValue = password.value;

    if (!usernameValue || !passwordValue) {
        message.textContent = 'Completa todos los campos';
        return;
    }

    validateAdmin(usernameValue, passwordValue).then(validAdmin => {
        if (validAdmin) {
            console.log('Admin login exitoso:', usernameValue);
            isLoggedIn = true;
            isAdmin = true;
            currentUser = validAdmin.username;
            message.textContent = '';
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('adminScreen').style.display = 'flex';
            username.value = '';
            password.value = '';
            loadRegistrationRequests();
        } else {
            message.textContent = 'Admin o contraseña incorrectos';
            password.value = '';
        }
    });
}

function toggleAdminMode() {
    const loginForm = document.getElementById('loginForm');
    const adminForm = document.getElementById('adminForm');

    if (!loginForm || !adminForm) return;

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        adminForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        adminForm.style.display = 'block';
    }

    document.getElementById('loginMessage').textContent = '';
    document.getElementById('adminMessage').textContent = '';
}

function toggleRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (!loginForm || !registerForm) return;

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
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

    if (!username || !password || !confirmPassword || !email || !message) return;

    const usernameValue = username.value.trim();
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;
    const emailValue = email.value.trim();

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

    const success = await registerUser(usernameValue, passwordValue, emailValue);
    
    if (success) {
        username.value = '';
        password.value = '';
        confirmPassword.value = '';
        email.value = '';
        
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('loginUsername').focus();
        
        message.textContent = '';
    }
}

// ========== FUNCIONES DE ADMINISTRACIÓN ==========

async function loadRegistrationRequests() {
    try {
        if (!supabaseClient) {
            alert('Servidor no disponible');
            return;
        }

        const { data, error } = await supabaseClient
            .from('registration_requests')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;

        displayRegistrationRequests(data || []);

    } catch (error) {
        console.error('Error cargando solicitudes:', error);
        alert('Error al cargar las solicitudes');
    }
}

function displayRegistrationRequests(requests) {
    const container = document.getElementById('requestsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (requests.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No hay solicitudes pendientes</p>';
        return;
    }

    requests.forEach(request => {
        const requestDiv = document.createElement('div');
        requestDiv.className = 'request-item';
        requestDiv.innerHTML = `
            <div class="request-info">
                <h3>👤 ${request.username}</h3>
                <p>📧 ${request.email || 'Sin email'}</p>
                <p>📅 ${new Date(request.created_at).toLocaleDateString()}</p>
            </div>
            <div class="request-actions">
                <button class="approve-btn" onclick="approveUser('${request.username}')">✓ Aprobar</button>
                <button class="reject-btn" onclick="rejectUser('${request.username}')">✕ Rechazar</button>
            </div>
        `;
        container.appendChild(requestDiv);
    });
}

async function approveUser(username) {
    try {
        if (!confirm(`¿Aprobar a ${username}?`)) return;

        if (!supabaseClient) {
            alert('Servidor no disponible');
            return;
        }

        // Crear usuario aprobado
        const { data, error } = await supabaseClient
            .from('users')
            .insert([{
                username: username,
                password: btoa('provisional123'), // Contraseña temporal
                email: '',
                approved: true,
                approved_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;

        // Actualizar solicitud como aprobada
        await supabaseClient
            .from('registration_requests')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: currentUser
            })
            .eq('username', username);

        alert(`Usuario ${username} aprobado exitosamente`);
        loadRegistrationRequests();

    } catch (error) {
        console.error('Error aprobando usuario:', error);
        alert('Error al aprobar usuario');
    }
}

async function rejectUser(username) {
    try {
        const notes = prompt('¿Motivo del rechazo?');
        if (notes === null) return;

        if (!supabaseClient) {
            alert('Servidor no disponible');
            return;
        }

        // Actualizar solicitud como rechazada
        const { error } = await supabaseClient
            .from('registration_requests')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                reviewed_by: currentUser,
                admin_notes: notes
            })
            .eq('username', username);

        if (error) throw error;

        alert(`Usuario ${username} rechazado`);
        loadRegistrationRequests();

    } catch (error) {
        console.error('Error rechazando usuario:', error);
        alert('Error al rechazar usuario');
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
            const saved = localStorage.getItem('portalButtons');
            return saved ? JSON.parse(saved) : defaultButtons;
        }

        updateSyncStatus('🔄 Sincronizando...', 'syncing');

        const { data, error } = await supabaseClient
            .from('buttons')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
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
        if (!supabaseClient) return;

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

    if (!name || !url || !emoji || !color) return;

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

function handleLogout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        isLoggedIn = false;
        isAdmin = false;
        currentUser = null;
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('adminScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginUsername').focus();
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
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminBackBtn = document.getElementById('adminBackBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (registerToggleBtn) {
        registerToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleRegisterForm();
        });
    }
    
    if (loginBackBtn) {
        loginBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleRegisterForm();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }

    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAdminMode();
        });
    }

    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleAdminLogin();
        });
    }

    if (adminBackBtn) {
        adminBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAdminMode();
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
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
