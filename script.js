// Memora - Vanilla JavaScript Implementation

// Authentication System
const VALID_ACTIVATION_KEY = 'josh-fkdj-fgjd';
const ADMIN_PASSWORD = '0872';

// Initialize users from localStorage
let users = JSON.parse(localStorage.getItem('memora_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('memora_current_user')) || null;
let appSettings = JSON.parse(localStorage.getItem('memora_settings')) || {
    logo: 'Memora',
    accent: '#e94560'
};

// Apply saved settings
function applySettings() {
    document.querySelectorAll('#app-logo, #login-logo, #register-logo').forEach(el => {
        el.textContent = appSettings.logo;
    });
    document.documentElement.style.setProperty('--accent', appSettings.accent);
}

applySettings();

// Check if user is logged in
function checkAuth() {
    if (currentUser) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('register-page').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('current-username').textContent = currentUser.username;
    } else {
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('register-page').classList.add('hidden');
        document.getElementById('app-container').classList.add('hidden');
    }
}

checkAuth();

// Login form
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('memora_current_user', JSON.stringify(currentUser));
        checkAuth();
        document.getElementById('login-form').reset();
    } else {
        alert('Invalid username or password');
    }
});

// Register form
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const key = document.getElementById('register-key').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (key !== VALID_ACTIVATION_KEY) {
        alert('Invalid activation key');
        return;
    }
    
    if (users.find(u => u.username === username)) {
        alert('Username already exists');
        return;
    }
    
    users.push({ username, password, key });
    localStorage.setItem('memora_users', JSON.stringify(users));
    alert('Registration successful! Please login.');
    document.getElementById('register-form').reset();
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
});

// Switch between login and register
document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('memora_current_user');
    checkAuth();
});

// Admin Modal
document.getElementById('admin-btn').addEventListener('click', () => {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-settings').classList.add('hidden');
    document.getElementById('admin-password').value = '';
});

document.getElementById('close-admin').addEventListener('click', () => {
    document.getElementById('admin-modal').classList.add('hidden');
});

document.getElementById('admin-login-btn').addEventListener('click', () => {
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-settings').classList.remove('hidden');
    } else {
        alert('Invalid admin password');
    }
});

// Change Logo
document.getElementById('save-logo').addEventListener('click', () => {
    const newLogo = document.getElementById('new-logo').value.trim();
    if (newLogo) {
        appSettings.logo = newLogo;
        localStorage.setItem('memora_settings', JSON.stringify(appSettings));
        applySettings();
        document.getElementById('new-logo').value = '';
        alert('Logo updated successfully!');
    }
});

// Change Accent Color
document.getElementById('save-accent').addEventListener('click', () => {
    const newAccent = document.getElementById('new-accent').value;
    appSettings.accent = newAccent;
    localStorage.setItem('memora_settings', JSON.stringify(appSettings));
    applySettings();
    alert('Accent color updated successfully!');
});

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tool-section').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        const toolId = btn.getAttribute('data-tool');
        document.getElementById(toolId).classList.add('active');
    });
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const toolName = btn.textContent.toLowerCase();
        btn.style.display = toolName.includes(query) ? 'block' : 'none';
    });
});

// Calculator
let calcDisplay = document.getElementById('calcDisplay');
let calcExpression = '';

document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        
        if (value === 'C') {
            calcExpression = '';
            calcDisplay.value = '';
        } else if (value === '=') {
            try {
                calcExpression = eval(calcExpression).toString();
                calcDisplay.value = calcExpression;
            } catch (e) {
                calcDisplay.value = 'Error';
                calcExpression = '';
            }
        } else {
            calcExpression += value;
            calcDisplay.value = calcExpression;
        }
    });
});

// Password Manager (localStorage)
let passwords = JSON.parse(localStorage.getItem('memora_passwords')) || [];

document.getElementById('pm-save').addEventListener('click', () => {
    const website = document.getElementById('pm-website').value;
    const username = document.getElementById('pm-username').value;
    const password = document.getElementById('pm-password').value;
    const notes = document.getElementById('pm-notes').value;

    if (website && username && password) {
        passwords.push({ id: Date.now(), website, username, password, notes });
        localStorage.setItem('memora_passwords', JSON.stringify(passwords));
        renderPasswords();
        document.getElementById('pm-website').value = '';
        document.getElementById('pm-username').value = '';
        document.getElementById('pm-password').value = '';
        document.getElementById('pm-notes').value = '';
    }
});

function renderPasswords() {
    const list = document.getElementById('pmList');
    list.innerHTML = passwords.map(p => `
        <div class="pm-item">
            <strong>${p.website}</strong> - ${p.username}
            <button onclick="deletePassword(${p.id})">Delete</button>
        </div>
    `).join('');
}

function deletePassword(id) {
    passwords = passwords.filter(p => p.id !== id);
    localStorage.setItem('memora_passwords', JSON.stringify(passwords));
    renderPasswords();
}

// Notes (localStorage)
let notes = JSON.parse(localStorage.getItem('memora_notes')) || [];

document.getElementById('note-save').addEventListener('click', () => {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    if (title && content) {
        notes.push({ id: Date.now(), title, content, date: new Date().toLocaleDateString() });
        localStorage.setItem('memora_notes', JSON.stringify(notes));
        renderNotes();
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
    }
});

function renderNotes() {
    const list = document.getElementById('notesList');
    list.innerHTML = notes.map(n => `
        <div class="note-item">
            <strong>${n.title}</strong>
            <small>${n.date}</small>
            <p>${n.content.substring(0, 100)}...</p>
            <button onclick="deleteNote(${n.id})">Delete</button>
        </div>
    `).join('');
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('memora_notes', JSON.stringify(notes));
    renderNotes();
}

// Calendar
let currentDate = new Date();

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthSpan = document.getElementById('currentMonth');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthSpan.textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="calendar-day-header">${d}</div>`).join('');
    
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        html += `<div class="calendar-day">${day}</div>`;
    }
    
    grid.innerHTML = html;
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

// Tasks (localStorage)
let tasks = JSON.parse(localStorage.getItem('memora_tasks')) || [];

document.getElementById('task-add').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    const task = input.value.trim();
    
    if (task) {
        tasks.push({ id: Date.now(), text: task, completed: false });
        localStorage.setItem('memora_tasks', JSON.stringify(tasks));
        renderTasks();
        input.value = '';
    }
});

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = tasks.map(t => `
        <li class="task-item ${t.completed ? 'completed' : ''}">
            <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${t.id})">
            <span>${t.text}</span>
            <button onclick="deleteTask(${t.id})">Delete</button>
        </li>
    `).join('');
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem('memora_tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('memora_tasks', JSON.stringify(tasks));
    renderTasks();
}

// Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clockDisplay').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Password Generator
document.getElementById('pg-generate').addEventListener('click', () => {
    const length = parseInt(document.getElementById('pg-length').value);
    const useUpper = document.getElementById('pg-uppercase').checked;
    const useLower = document.getElementById('pg-lowercase').checked;
    const useNumbers = document.getElementById('pg-numbers').checked;
    const useSymbols = document.getElementById('pg-symbols').checked;
    
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    document.getElementById('pg-result').value = password;
});

document.getElementById('pg-copy').addEventListener('click', () => {
    const result = document.getElementById('pg-result');
    result.select();
    document.execCommand('copy');
});

// Unit Converter
const unitConversions = {
    length: {
        'meters': 1,
        'kilometers': 0.001,
        'centimeters': 100,
        'miles': 0.000621371,
        'feet': 3.28084,
        'inches': 39.3701
    },
    weight: {
        'kilograms': 1,
        'grams': 1000,
        'pounds': 2.20462,
        'ounces': 35.274
    },
    temperature: {
        'celsius': 'c',
        'fahrenheit': 'f',
        'kelvin': 'k'
    }
};

document.getElementById('uc-type').addEventListener('change', updateUnitOptions);

function updateUnitOptions() {
    const type = document.getElementById('uc-type').value;
    const fromUnit = document.getElementById('uc-from-unit');
    const toUnit = document.getElementById('uc-to-unit');
    
    const units = Object.keys(unitConversions[type]);
    fromUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    toUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
}

updateUnitOptions();

document.getElementById('uc-convert').addEventListener('click', () => {
    const type = document.getElementById('uc-type').value;
    const fromValue = parseFloat(document.getElementById('uc-from').value);
    const fromUnit = document.getElementById('uc-from-unit').value;
    const toUnit = document.getElementById('uc-to-unit').value;
    
    let result;
    
    if (type === 'temperature') {
        // Special handling for temperature
        let celsius;
        if (fromUnit === 'celsius') celsius = fromValue;
        else if (fromUnit === 'fahrenheit') celsius = (fromValue - 32) * 5/9;
        else if (fromUnit === 'kelvin') celsius = fromValue - 273.15;
        
        if (toUnit === 'celsius') result = celsius;
        else if (toUnit === 'fahrenheit') result = celsius * 9/5 + 32;
        else if (toUnit === 'kelvin') result = celsius + 273.15;
    } else {
        const fromFactor = unitConversions[type][fromUnit];
        const toFactor = unitConversions[type][toUnit];
        result = (fromValue / fromFactor) * toFactor;
    }
    
    document.getElementById('uc-to').value = result.toFixed(4);
});

// Currency Converter (using mock rates - in production, use an API)
const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0
};

document.getElementById('cc-convert').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('cc-amount').value);
    const from = document.getElementById('cc-from').value;
    const to = document.getElementById('cc-to').value;
    
    const result = (amount / exchangeRates[from]) * exchangeRates[to];
    document.getElementById('ccResult').textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
});

// Text Tools
document.getElementById('tt-input').addEventListener('input', updateTextStats);

function updateTextStats() {
    const text = document.getElementById('tt-input').value;
    document.getElementById('tt-chars').textContent = text.length;
    document.getElementById('tt-words').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
}

document.getElementById('tt-upper').addEventListener('click', () => {
    document.getElementById('tt-input').value = document.getElementById('tt-input').value.toUpperCase();
});

document.getElementById('tt-lower').addEventListener('click', () => {
    document.getElementById('tt-input').value = document.getElementById('tt-input').value.toLowerCase();
});

document.getElementById('tt-title').addEventListener('click', () => {
    const text = document.getElementById('tt-input').value;
    document.getElementById('tt-input').value = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
});

document.getElementById('tt-sentence').addEventListener('click', () => {
    const text = document.getElementById('tt-input').value;
    document.getElementById('tt-input').value = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
});

document.getElementById('tt-duplicate').addEventListener('click', () => {
    const text = document.getElementById('tt-input').value;
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    document.getElementById('tt-input').value = unique.join('\n');
});

document.getElementById('tt-sort').addEventListener('click', () => {
    const text = document.getElementById('tt-input').value;
    const lines = text.split('\n');
    lines.sort();
    document.getElementById('tt-input').value = lines.join('\n');
});

// Random Generator
document.getElementById('rg-number-generate').addEventListener('click', () => {
    const min = parseInt(document.getElementById('rg-min').value);
    const max = parseInt(document.getElementById('rg-max').value);
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    document.getElementById('rg-number-result').textContent = result;
});

document.getElementById('rg-uuid-generate').addEventListener('click', () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    document.getElementById('rg-uuid-result').textContent = uuid;
});

document.getElementById('rg-color-generate').addEventListener('click', () => {
    const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    document.getElementById('rg-color-result').textContent = color;
    document.getElementById('rg-color-result').style.color = color;
});

// Weather (using mock data - in production, use an API)
document.getElementById('weather-search').addEventListener('click', () => {
    const city = document.getElementById('weather-city').value;
    // Mock weather data
    const mockWeather = {
        temp: Math.floor(Math.random() * 30) + 10,
        humidity: Math.floor(Math.random() * 50) + 30,
        wind: Math.floor(Math.random() * 20) + 5,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)]
    };
    
    document.getElementById('weatherDisplay').innerHTML = `
        <h3>${city}</h3>
        <p>Temperature: ${mockWeather.temp}°C</p>
        <p>Humidity: ${mockWeather.humidity}%</p>
        <p>Wind: ${mockWeather.wind} km/h</p>
        <p>Condition: ${mockWeather.condition}</p>
    `;
});

// QR Generator (using QRCode.js library would be needed in production)
document.getElementById('qr-generate').addEventListener('click', () => {
    const text = document.getElementById('qr-input').value;
    if (text) {
        // In production, use a QR code library like QRCode.js
        document.getElementById('qrDisplay').innerHTML = `<p>QR Code for: ${text}</p><p>(QR code library needed for actual generation)</p>`;
    }
});

// Initialize
renderPasswords();
renderNotes();
renderTasks();
