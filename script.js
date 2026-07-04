// Memora AI - Vanilla JavaScript Implementation

// Authentication System
const VALID_ACTIVATION_KEY = 'josh-fkdj-fgjd';
const ADMIN_PASSWORD = '0872';

// Initialize users from localStorage
let users = JSON.parse(localStorage.getItem('memora_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('memora_current_user')) || null;
let appSettings = JSON.parse(localStorage.getItem('memora_settings')) || {
    logo: 'Memora AI',
    accent: '#6366f1',
    fontSize: 15
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
    renderUsers();
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

// Export Settings
document.getElementById('export-settings').addEventListener('click', () => {
    const settings = {
        logo: appSettings.logo,
        logoImage: appSettings.logoImage,
        accent: appSettings.accent,
        fontSize: appSettings.fontSize
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
            fontSize: 15
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

// AI Response Generator (Simple mock AI with code capabilities)
function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Code generation patterns
    if (lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('javascript') || 
        lowerMessage.includes('html') || lowerMessage.includes('css') || lowerMessage.includes('python') ||
        lowerMessage.includes('write') && (lowerMessage.includes('code') || lowerMessage.includes('function'))) {
        return generateCodeResponse(userMessage);
    }
    
    // Simple pattern matching for responses
    const responses = {
        'hello': 'Hello! How can I assist you today?',
        'hi': 'Hi there! What can I help you with?',
        'how are you': 'I\'m doing great, thank you for asking! How about you?',
        'what can you do': 'I can help you with coding tasks, write code in various languages, answer questions, and have conversations. Just ask me to write some code!',
        'help': 'I\'m here to help! You can ask me to write code, explain programming concepts, or have a conversation.',
        'bye': 'Goodbye! Have a great day!',
        'thank': 'You\'re welcome! Is there anything else I can help you with?',
        'name': 'I\'m Memora AI, your intelligent coding assistant.',
        'who are you': 'I\'m Memora AI, an AI assistant designed to help you with coding and answer your questions.',
        'weather': 'I don\'t have access to real-time weather data, but you can check weather apps or websites for accurate forecasts.',
        'time': `The current time is ${new Date().toLocaleTimeString()}.`,
        'date': `Today's date is ${new Date().toLocaleDateString()}.`,
        'joke': 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
        'advice': 'Remember to take breaks and stay hydrated while coding. Your health is important!',
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
