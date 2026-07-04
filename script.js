// Memora AI - Vanilla JavaScript Implementation

// Authentication System
const VALID_ACTIVATION_KEY = 'josh-fkdj-fgjd';
const ADMIN_PASSWORD = '0872';

// Initialize users from localStorage
let users = JSON.parse(localStorage.getItem('memora_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('memora_current_user')) || null;
let appSettings = JSON.parse(localStorage.getItem('memora_settings')) || {
    logo: 'Memora AI',
    accent: '#6366f1'
};

// Apply saved settings
function applySettings() {
    // Apply logo (text or image)
    document.querySelectorAll('#app-logo, #login-logo, #register-logo, #logo-text').forEach(el => {
        if (appSettings.logoImage) {
            el.innerHTML = `<img src="${appSettings.logoImage}" alt="Logo" style="max-height: 50px; object-fit: contain;">`;
        } else {
            el.textContent = appSettings.logo;
        }
    });
    
    // Update admin page logo preview
    const logoPreview = document.getElementById('logo-preview');
    if (logoPreview) {
        if (appSettings.logoImage) {
            logoPreview.innerHTML = `<img src="${appSettings.logoImage}" alt="Logo">`;
            document.getElementById('remove-logo-btn').classList.remove('hidden');
        } else {
            logoPreview.innerHTML = `<span id="logo-text">${appSettings.logo}</span>`;
            document.getElementById('remove-logo-btn').classList.add('hidden');
        }
    }
    
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

// Admin Page
document.getElementById('admin-btn').addEventListener('click', () => {
    document.getElementById('admin-page').classList.remove('hidden');
    document.getElementById('admin-login-section').classList.remove('hidden');
    document.getElementById('admin-settings-section').classList.add('hidden');
    document.getElementById('admin-password').value = '';
    applySettings();
});

document.getElementById('back-to-chat').addEventListener('click', () => {
    document.getElementById('admin-page').classList.add('hidden');
});

document.getElementById('admin-login-btn').addEventListener('click', () => {
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('admin-login-section').classList.add('hidden');
        document.getElementById('admin-settings-section').classList.remove('hidden');
    } else {
        alert('Invalid admin password');
    }
});

// Logo Upload
document.getElementById('upload-logo-btn').addEventListener('click', () => {
    document.getElementById('logo-upload').click();
});

document.getElementById('logo-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            appSettings.logoImage = event.target.result;
            localStorage.setItem('memora_settings', JSON.stringify(appSettings));
            applySettings();
            alert('Logo uploaded successfully!');
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('remove-logo-btn').addEventListener('click', () => {
    appSettings.logoImage = null;
    localStorage.setItem('memora_settings', JSON.stringify(appSettings));
    applySettings();
    alert('Logo removed successfully!');
});

// Change Accent Color
document.getElementById('save-accent').addEventListener('click', () => {
    const newAccent = document.getElementById('new-accent').value;
    appSettings.accent = newAccent;
    localStorage.setItem('memora_settings', JSON.stringify(appSettings));
    applySettings();
    alert('Accent color updated successfully!');
});

// AI Chat System
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');

// AI Response Generator (Simple mock AI)
function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple pattern matching for responses
    const responses = {
        'hello': 'Hello! How can I assist you today?',
        'hi': 'Hi there! What can I help you with?',
        'how are you': 'I\'m doing great, thank you for asking! How about you?',
        'what can you do': 'I can help you with various tasks, answer questions, and have conversations. Feel free to ask me anything!',
        'help': 'I\'m here to help! You can ask me questions, have a conversation, or request assistance with various topics.',
        'bye': 'Goodbye! Have a great day!',
        'thank': 'You\'re welcome! Is there anything else I can help you with?',
        'name': 'I\'m Memora AI, your intelligent assistant.',
        'who are you': 'I\'m Memora AI, an AI assistant designed to help you with various tasks and answer your questions.',
        'weather': 'I don\'t have access to real-time weather data, but you can check weather apps or websites for accurate forecasts.',
        'time': `The current time is ${new Date().toLocaleTimeString()}.`,
        'date': `Today's date is ${new Date().toLocaleDateString()}.`,
        'joke': 'Why did the scarecrow win an award? Because he was outstanding in his field!',
        'advice': 'Remember to take breaks and stay hydrated while working. Your health is important!',
    };
    
    // Check for exact matches
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return value;
        }
    }
    
    // Default responses
    const defaultResponses = [
        'That\'s an interesting question! Let me think about it.',
        'I understand. Could you tell me more about that?',
        'That\'s a great point! What else would you like to know?',
        'I\'m here to help. Please feel free to ask more questions.',
        'Interesting! Let me provide some thoughts on that.',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = `<p>${content}</p>`;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    
    // Simulate AI thinking delay
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessage(aiResponse, false);
    }, 500 + Math.random() * 1000);
}

// Event listeners for chat
sendButton.addEventListener('click', handleSendMessage);

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

// Auto-resize textarea
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});
