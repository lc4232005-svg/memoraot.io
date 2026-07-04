// Memora AI - Vanilla JavaScript Implementation

// Authentication System
const ADMIN_PASSWORD = '0872';

// Initialize users from localStorage
let users = JSON.parse(localStorage.getItem('memora_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('memora_current_user')) || null;
let activationKeys = JSON.parse(localStorage.getItem('memora_activation_keys')) || ['josh-fkdj-fgjd'];
let chatHistory = JSON.parse(localStorage.getItem('memora_chat_history')) || {};
let currentChatId = null;
let appSettings = JSON.parse(localStorage.getItem('memora_settings')) || {
    logo: 'Memora AI',
    accent: '#6366f1',
    fontSize: 15,
    borderRadius: 12,
    chatStyle: 'modern'
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
    
    // Apply font size
    if (appSettings.fontSize) {
        document.documentElement.style.setProperty('--base-font-size', appSettings.fontSize + 'px');
        document.body.style.fontSize = appSettings.fontSize + 'px';
    }
    
    // Update font size slider
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.value = appSettings.fontSize || 15;
        fontSizeValue.textContent = (appSettings.fontSize || 15) + 'px';
    }
    
    // Update border radius slider
    const borderRadiusSlider = document.getElementById('border-radius');
    const borderRadiusValue = document.getElementById('border-radius-value');
    if (borderRadiusSlider && borderRadiusValue) {
        borderRadiusSlider.value = appSettings.borderRadius || 12;
        borderRadiusValue.textContent = (appSettings.borderRadius || 12) + 'px';
        document.documentElement.style.setProperty('--border-radius', appSettings.borderRadius + 'px');
    }
    
    // Update chat style
    const chatStyleInputs = document.querySelectorAll('input[name="chat-style"]');
    chatStyleInputs.forEach(input => {
        if (input.value === (appSettings.chatStyle || 'modern')) {
            input.checked = true;
        }
    });
}

applySettings();

// Check if user is logged in
function checkAuth() {
    if (currentUser) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('register-page').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('current-username').textContent = currentUser.username;
        initChat();
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
    
    if (!activationKeys.includes(key)) {
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
    renderUsers();
    renderKeys();
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

// Theme Presets
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const accent = btn.getAttribute('data-accent');
        appSettings.accent = accent;
        localStorage.setItem('memora_settings', JSON.stringify(appSettings));
        applySettings();
        alert('Theme applied successfully!');
    });
});

// Font Size
document.getElementById('font-size').addEventListener('input', (e) => {
    const fontSize = e.target.value;
    document.getElementById('font-size-value').textContent = fontSize + 'px';
    appSettings.fontSize = parseInt(fontSize);
    localStorage.setItem('memora_settings', JSON.stringify(appSettings));
    applySettings();
});

// Border Radius
document.getElementById('border-radius').addEventListener('input', (e) => {
    const borderRadius = e.target.value;
    document.getElementById('border-radius-value').textContent = borderRadius + 'px';
    appSettings.borderRadius = parseInt(borderRadius);
    localStorage.setItem('memora_settings', JSON.stringify(appSettings));
    applySettings();
});

// Chat Style
document.querySelectorAll('input[name="chat-style"]').forEach(input => {
    input.addEventListener('change', (e) => {
        appSettings.chatStyle = e.target.value;
        localStorage.setItem('memora_settings', JSON.stringify(appSettings));
        applySettings();
        alert('Chat style updated!');
    });
});

// User Management
function renderUsers() {
    const userList = document.getElementById('user-list');
    if (!userList) return;
    
    if (users.length === 0) {
        userList.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No users registered yet.</p>';
        return;
    }
    
    userList.innerHTML = users.map((user, index) => `
        <div class="user-item">
            <div class="user-item-info">
                <span class="user-item-name">${user.username}</span>
                <span class="user-item-date">Registered: ${new Date().toLocaleDateString()}</span>
            </div>
            <button class="user-item-delete" onclick="deleteUser(${index})">Delete</button>
        </div>
    `).join('');
}

function deleteUser(index) {
    if (confirm('Are you sure you want to delete this user?')) {
        users.splice(index, 1);
        localStorage.setItem('memora_users', JSON.stringify(users));
        renderUsers();
        alert('User deleted successfully!');
    }
}

document.getElementById('refresh-users').addEventListener('click', () => {
    users = JSON.parse(localStorage.getItem('memora_users')) || [];
    renderUsers();
});

// Activation Key Management
function renderKeys() {
    const keyList = document.getElementById('key-list');
    if (!keyList) return;
    
    if (activationKeys.length === 0) {
        keyList.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No activation keys yet.</p>';
        return;
    }
    
    keyList.innerHTML = activationKeys.map((key, index) => `
        <div class="key-item">
            <div class="key-item-info">
                <span class="key-item-key">${key}</span>
            </div>
            <button class="key-item-delete" onclick="deleteKey(${index})">Delete</button>
        </div>
    `).join('');
}

function deleteKey(index) {
    if (confirm('Are you sure you want to delete this activation key?')) {
        activationKeys.splice(index, 1);
        localStorage.setItem('memora_activation_keys', JSON.stringify(activationKeys));
        renderKeys();
        alert('Key deleted successfully!');
    }
}

document.getElementById('add-key').addEventListener('click', () => {
    const newKey = document.getElementById('new-key').value.trim();
    if (!newKey) {
        alert('Please enter an activation key');
        return;
    }
    
    if (activationKeys.includes(newKey)) {
        alert('This key already exists');
        return;
    }
    
    activationKeys.push(newKey);
    localStorage.setItem('memora_activation_keys', JSON.stringify(activationKeys));
    document.getElementById('new-key').value = '';
    renderKeys();
    alert('Key added successfully!');
});

// Export Settings
document.getElementById('export-settings').addEventListener('click', () => {
    const settings = {
        logo: appSettings.logo,
        logoImage: appSettings.logoImage,
        accent: appSettings.accent,
        fontSize: appSettings.fontSize,
        borderRadius: appSettings.borderRadius,
        chatStyle: appSettings.chatStyle
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'memora-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

// Import Settings
document.getElementById('import-settings').addEventListener('click', () => {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedSettings = JSON.parse(event.target.result);
                
                if (importedSettings.logo) appSettings.logo = importedSettings.logo;
                if (importedSettings.logoImage) appSettings.logoImage = importedSettings.logoImage;
                if (importedSettings.accent) appSettings.accent = importedSettings.accent;
                if (importedSettings.fontSize) appSettings.fontSize = importedSettings.fontSize;
                if (importedSettings.borderRadius) appSettings.borderRadius = importedSettings.borderRadius;
                if (importedSettings.chatStyle) appSettings.chatStyle = importedSettings.chatStyle;
                
                localStorage.setItem('memora_settings', JSON.stringify(appSettings));
                applySettings();
                alert('Settings imported successfully!');
            } catch (error) {
                alert('Invalid settings file. Please try again.');
            }
        };
        reader.readAsText(file);
    }
});

// Reset to Defaults
document.getElementById('reset-settings').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
        appSettings = {
            logo: 'Memora AI',
            accent: '#6366f1',
            fontSize: 15,
            borderRadius: 12,
            chatStyle: 'modern'
        };
        localStorage.setItem('memora_settings', JSON.stringify(appSettings));
        applySettings();
        alert('Settings reset to defaults!');
    }
});

// AI Chat System
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');

// Initialize chat
function initChat() {
    if (currentUser) {
        const userChats = chatHistory[currentUser.username] || [];
        if (userChats.length === 0) {
            // Create new chat
            createNewChat();
        } else {
            // Load most recent chat
            currentChatId = userChats[0].id;
            loadChat(currentChatId);
        }
    }
}

function createNewChat() {
    const newId = Date.now().toString();
    const newChat = {
        id: newId,
        messages: [
            {
                role: 'ai',
                content: 'Hello! I\'m your AI assistant. How can I help you today?'
            }
        ],
        createdAt: new Date().toISOString()
    };
    
    if (!chatHistory[currentUser.username]) {
        chatHistory[currentUser.username] = [];
    }
    
    chatHistory[currentUser.username].unshift(newChat);
    currentChatId = newId;
    saveChatHistory();
    loadChat(newId);
}

function loadChat(chatId) {
    const userChats = chatHistory[currentUser.username] || [];
    const chat = userChats.find(c => c.id === chatId);
    
    if (chat) {
        chatMessages.innerHTML = '';
        chat.messages.forEach(msg => {
            addMessageToDOM(msg.content, msg.role === 'user');
        });
    }
}

function saveChatHistory() {
    localStorage.setItem('memora_chat_history', JSON.stringify(chatHistory));
}

function addMessageToDOM(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const parsedContent = parseCodeBlocks(content);
    messageContent.innerHTML = parsedContent;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// New Chat Button
document.getElementById('new-chat-btn').addEventListener('click', () => {
    createNewChat();
});

// AI Response Generator (Enhanced mock AI with code capabilities)
function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Code generation patterns
    if (lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('javascript') || 
        lowerMessage.includes('html') || lowerMessage.includes('css') || lowerMessage.includes('python') ||
        lowerMessage.includes('write') && (lowerMessage.includes('code') || lowerMessage.includes('function'))) {
        return generateCodeResponse(userMessage);
    }
    
    // Math calculations
    if (lowerMessage.includes('calculate') || lowerMessage.includes('math') || lowerMessage.includes('what is') && /\d+/.test(userMessage)) {
        return generateMathResponse(userMessage);
    }
    
    // Enhanced pattern matching for responses
    const responses = {
        'hello': ['Hello! How can I assist you today?', 'Hi there! What can I help you with?', 'Hey! How can I help you today?'],
        'hi': ['Hi there! What can I help you with?', 'Hello! How are you doing?', 'Hey! What\'s on your mind?'],
        'how are you': ['I\'m doing great, thank you for asking! How about you?', 'I\'m functioning perfectly! How can I assist you?', 'All systems operational! What do you need help with?'],
        'what can you do': ['I can help you with coding tasks, write code in various languages, answer questions, do math calculations, and have conversations. Just ask me to write some code or solve a problem!', 'I\'m a coding assistant! I can write JavaScript, Python, HTML, CSS, React, SQL code, help with math, and answer your questions.'],
        'help': ['I\'m here to help! You can ask me to write code, explain programming concepts, do calculations, or just have a conversation. What would you like to know?', 'Need help? I can assist with coding, math, or general questions. Just ask!'],
        'bye': ['Goodbye! Have a great day!', 'See you later! Feel free to come back anytime.', 'Take care! Happy coding!'],
        'thank': ['You\'re welcome! Is there anything else I can help you with?', 'Happy to help! Let me know if you need anything else.', 'No problem! I\'m here whenever you need assistance.'],
        'name': ['I\'m Memora AI, your intelligent coding assistant.', 'I\'m Memora AI, designed to help you with coding and answer questions.'],
        'who are you': ['I\'m Memora AI, an AI assistant designed to help you with coding, math, and answer your questions.', 'I\'m Memora AI - your personal coding and math assistant!'],
        'weather': ['I don\'t have access to real-time weather data, but you can check weather apps or websites for accurate forecasts.', 'For weather information, I\'d recommend checking a weather service like Weather.com or your phone\'s weather app.'],
        'time': () => `The current time is ${new Date().toLocaleTimeString()}.`,
        'date': () => `Today's date is ${new Date().toLocaleDateString()}.`,
        'joke': ['Why do programmers prefer dark mode? Because light attracts bugs! 🐛', 'Why did the developer go broke? Because he used up all his cache!', 'What\'s a programmer\'s favorite hangout place? Foo Bar!'],
        'advice': ['Remember to take breaks and stay hydrated while coding. Your health is important!', 'Tip: Write clean, commented code. Future you will thank present you!', 'Best practice: Test your code frequently and use version control!'],
        'api': ['I can help you with API integration! Ask me about REST APIs, fetch requests, or specific API implementations.', 'Need help with APIs? I can show you how to make requests, handle responses, and work with JSON data.'],
        'database': ['I can help with database queries! Ask me about SQL, CRUD operations, or database design.', 'Need database help? I can write SQL queries, explain database concepts, or help with data modeling.'],
        'debug': ['Debugging tip: Use console.log() to track variable values and flow. Add breakpoints in your browser\'s developer tools.', 'Having issues? Try isolating the problem, checking for typos, and verifying your logic step by step.'],
        'git': ['I can help with Git commands! Ask me about commit, push, pull, branch, merge, and more.', 'Need Git help? I can explain version control concepts and provide command examples.'],
    };
    
    // Check for exact matches with random responses
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            if (typeof value === 'function') {
                return value();
            }
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        }
    }
    
    // Context-aware responses
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('how does')) {
        return generateExplanationResponse(userMessage);
    }
    
    if (lowerMessage.includes('fix') || lowerMessage.includes('error') || lowerMessage.includes('problem')) {
        return generateTroubleshootingResponse(userMessage);
    }
    
    // Default responses
    const defaultResponses = [
        'That\'s an interesting question! Let me think about it. Could you provide more details?',
        'I understand. Could you tell me more about what you\'re trying to accomplish?',
        'That\'s a great point! What else would you like to know?',
        'I\'m here to help. Please feel free to ask more specific questions.',
        'Interesting! Let me provide some thoughts on that. What aspect would you like me to focus on?',
        'I can help with that! Could you give me more context or specific requirements?',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function generateMathResponse(userMessage) {
    // Extract numbers and operators
    const numbers = userMessage.match(/-?\d+\.?\d*/g);
    if (!numbers || numbers.length < 2) {
        return 'I can help with math! Please provide a calculation like "what is 5 + 3" or "calculate 10 * 5".';
    }
    
    const num1 = parseFloat(numbers[0]);
    const num2 = parseFloat(numbers[1]);
    const lowerMessage = userMessage.toLowerCase();
    
    let result;
    let operation;
    
    if (lowerMessage.includes('+') || lowerMessage.includes('plus') || lowerMessage.includes('add')) {
        result = num1 + num2;
        operation = '+';
    } else if (lowerMessage.includes('-') || lowerMessage.includes('minus') || lowerMessage.includes('subtract')) {
        result = num1 - num2;
        operation = '-';
    } else if (lowerMessage.includes('*') || lowerMessage.includes('times') || lowerMessage.includes('multiply') || lowerMessage.includes('x')) {
        result = num1 * num2;
        operation = '×';
    } else if (lowerMessage.includes('/') || lowerMessage.includes('divide') || lowerMessage.includes('÷')) {
        result = num1 / num2;
        operation = '÷';
    } else if (lowerMessage.includes('^') || lowerMessage.includes('power') || lowerMessage.includes('exponent')) {
        result = Math.pow(num1, num2);
        operation = '^';
    } else {
        result = num1 + num2;
        operation = '+';
    }
    
    return `${num1} ${operation} ${num2} = ${result.toFixed(2).replace(/\.00$/, '')}`;
}

function generateExplanationResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('variable')) {
        return `A variable is a container for storing data values. In programming, variables are used to hold information that can be referenced and manipulated. For example:

\`\`\`javascript
let name = "John";  // String variable
let age = 25;       // Number variable
let isActive = true; // Boolean variable
\`\`\`

Variables can hold different data types and their values can change during program execution.`;
    }
    
    if (lowerMessage.includes('function')) {
        return `A function is a reusable block of code that performs a specific task. Functions help organize code, make it reusable, and improve readability. Here's an example:

\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

// Call the function
console.log(greet("World")); // Output: Hello, World!
\`\`\`

Functions can take parameters (inputs) and return values (outputs). They're fundamental to programming.`;
    }
    
    if (lowerMessage.includes('array') || lowerMessage.includes('list')) {
        return `An array is a data structure that stores multiple values in a single variable. Arrays are ordered collections that can hold any data type. Example:

\`\`\`javascript
// Create an array
const fruits = ['apple', 'banana', 'orange'];

// Access elements
console.log(fruits[0]); // Output: apple

// Add elements
fruits.push('grape');

// Loop through array
fruits.forEach(fruit => console.log(fruit));
\`\`\`

Arrays are zero-indexed, meaning the first element is at index 0.`;
    }
    
    return `I'd be happy to explain that! Could you be more specific about what concept you'd like me to explain? I can help with programming concepts, math, or general topics.`;
}

function generateTroubleshootingResponse(userMessage) {
    return `Here are some general troubleshooting tips:

1. **Check for typos** - Small spelling mistakes can cause big errors
2. **Verify your logic** - Walk through your code step by step
3. **Use console.log()** - Print variable values to track what's happening
4. **Check the browser console** - Look for error messages
5. **Isolate the problem** - Comment out sections to find where the issue occurs
6. **Search for similar issues** - Others might have had the same problem

If you can share the specific error or code you're working with, I can provide more targeted help!`;
}

function generateCodeResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // JavaScript code examples
    if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
        if (lowerMessage.includes('hello') || lowerMessage.includes('print')) {
            return `Here's a JavaScript hello world example:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

This will print "Hello, World!" to the console.`;
        }
        if (lowerMessage.includes('function')) {
            return `Here's how to create a function in JavaScript:

\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

// Call the function
console.log(greet("World"));
\`\`\`

This function takes a name parameter and returns a greeting.`;
        }
        if (lowerMessage.includes('loop') || lowerMessage.includes('for')) {
            return `Here's a for loop example in JavaScript:

\`\`\`javascript
for (let i = 0; i < 5; i++) {
    console.log("Iteration: " + i);
}
\`\`\`

This will print numbers 0 through 4.`;
        }
        if (lowerMessage.includes('array') || lowerMessage.includes('list')) {
            return `Here's how to work with arrays in JavaScript:

\`\`\`javascript
// Create an array
const fruits = ['apple', 'banana', 'orange'];

// Add to array
fruits.push('grape');

// Loop through array
fruits.forEach(fruit => {
    console.log(fruit);
});

// Find element
const found = fruits.find(f => f === 'banana');
console.log(found);
\`\`\``;
        }
        if (lowerMessage.includes('async') || lowerMessage.includes('await')) {
            return `Here's an async/await example in JavaScript:

\`\`\`javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchData();
\`\`\``;
        }
        if (lowerMessage.includes('class')) {
            return `Here's how to create a class in JavaScript:

\`\`\`javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return "Hello, I'm " + this.name;
    }
}

const person = new Person("John", 30);
console.log(person.greet());
\`\`\``;
        }
        return `Here's a basic JavaScript example:

\`\`\`javascript
// Variables
let name = "Memora AI";
let version = 1.0;

// Function
function getInfo() {
    return name + " v" + version;
}

console.log(getInfo());
\`\`\``;
    }
    
    // HTML code examples
    if (lowerMessage.includes('html')) {
        if (lowerMessage.includes('form')) {
            return `Here's an HTML form example:

\`\`\`html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <button type="submit">Submit</button>
</form>
\`\`\``;
        }
        if (lowerMessage.includes('table')) {
            return `Here's an HTML table example:

\`\`\`html
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John</td>
            <td>30</td>
            <td>New York</td>
        </tr>
        <tr>
            <td>Jane</td>
            <td>25</td>
            <td>London</td>
        </tr>
    </tbody>
</table>
\`\`\``;
        }
        return `Here's a basic HTML structure:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
</body>
</html>
\`\`\``;
    }
    
    // CSS code examples
    if (lowerMessage.includes('css')) {
        if (lowerMessage.includes('flex') || lowerMessage.includes('flexbox')) {
            return `Here's a CSS Flexbox example:

\`\`\`css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.item {
    flex: 1;
    padding: 20px;
}
\`\`\``;
        }
        if (lowerMessage.includes('grid')) {
            return `Here's a CSS Grid example:

\`\`\`css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.item {
    padding: 20px;
}
\`\`\``;
        }
        if (lowerMessage.includes('animation')) {
            return `Here's a CSS animation example:

\`\`\`css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.element {
    animation: fadeIn 1s ease-in;
}
\`\`\``;
        }
        return `Here's some CSS styling:

\`\`\`css
body {
    background-color: #1a1a2e;
    color: white;
    font-family: Arial, sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
\`\`\``;
    }
    
    // Python code examples
    if (lowerMessage.includes('python')) {
        if (lowerMessage.includes('class')) {
            return `Here's a Python class example:

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name}"

person = Person("John", 30)
print(person.greet())
\`\`\``;
        }
        if (lowerMessage.includes('list') || lowerMessage.includes('array')) {
            return `Here's how to work with lists in Python:

\`\`\`python
# Create a list
fruits = ['apple', 'banana', 'orange']

# Add to list
fruits.append('grape')

# Loop through list
for fruit in fruits:
    print(fruit)

# List comprehension
squared = [x**2 for x in range(5)]
print(squared)
\`\`\``;
        }
        if (lowerMessage.includes('dict') || lowerMessage.includes('dictionary')) {
            return `Here's how to work with dictionaries in Python:

\`\`\`python
# Create a dictionary
person = {
    'name': 'John',
    'age': 30,
    'city': 'New York'
}

# Access values
print(person['name'])

# Add key-value pair
person['email'] = 'john@example.com'

# Loop through dictionary
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\``;
        }
        return `Here's a Python example:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

# Call the function
print(greet("World"))
\`\`\``;
    }
    
    // React code examples
    if (lowerMessage.includes('react')) {
        return `Here's a React component example:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}

export default Counter;
\`\`\``;
    }
    
    // SQL code examples
    if (lowerMessage.includes('sql') || lowerMessage.includes('database')) {
        return `Here's some SQL examples:

\`\`\`sql
-- Create table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- Insert data
INSERT INTO users (name, email) 
VALUES ('John', 'john@example.com');

-- Query data
SELECT * FROM users WHERE name = 'John';

-- Update data
UPDATE users SET email = 'newemail@example.com' 
WHERE id = 1;

-- Delete data
DELETE FROM users WHERE id = 1;
\`\`\``;
    }
    
    // Generic code response
    return `I can help you with code! Here's a simple example:

\`\`\`javascript
function example() {
    console.log("Hello from Memora AI!");
    return "Success";
}

example();
\`\`\`

I can help with JavaScript, Python, HTML, CSS, React, SQL, and more. Just ask me to write code in any language!`;
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Parse markdown-style code blocks
    const parsedContent = parseCodeBlocks(content);
    messageContent.innerHTML = parsedContent;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Add copy functionality to code blocks
    addCopyButtons();
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Save to chat history
    if (currentUser && currentChatId) {
        const userChats = chatHistory[currentUser.username] || [];
        const chat = userChats.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages.push({
                role: isUser ? 'user' : 'ai',
                content: content,
                timestamp: new Date().toISOString()
            });
            saveChatHistory();
        }
    }
}

function parseCodeBlocks(text) {
    // Replace markdown code blocks with HTML
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    
    return text.replace(codeBlockRegex, (match, language, code) => {
        const lang = language || 'text';
        const escapedCode = escapeHtml(code.trim());
        return `
            <div class="code-block-header">
                <span class="code-language">${lang}</span>
                <button class="copy-btn" onclick="copyCode(this)">Copy</button>
            </div>
            <pre><code class="language-${lang}">${escapedCode}</code></pre>
        `;
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyCode(button) {
    const codeBlock = button.closest('.code-block-header').nextElementSibling;
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, 2000);
    });
}

function addCopyButtons() {
    // Copy buttons are added inline in parseCodeBounds
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
