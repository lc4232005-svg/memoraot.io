# Memora - Modern Productivity Platform

A premium productivity website with everyday tools, built with plain HTML, CSS, and JavaScript.

## Features

- **Dashboard**: Customizable with sidebar, search bar, and widgets
- **Tools**: Calculator, Password Manager, Notes, Calendar, To-Do List, Weather, Clock, QR Generator, Password Generator, Unit Converter, Currency Converter, Text Tools, Random Generator
- **Local Storage**: Data persists in browser localStorage
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser localStorage
- **Styling**: Custom CSS with CSS variables
- **No dependencies required**

## Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Memora
```

2. Open `index.html` in your web browser:
```bash
# On Windows
start index.html

# On Mac
open index.html

# On Linux
xdg-open index.html
```

Or simply double-click `index.html` to open it in your default browser.

## Deployment

### GitHub Pages (Free)

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select "main" branch as source
4. Your site will be available at `https://yourusername.github.io/Memora`

### Netlify (Free)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: (root directory)
6. Click "Deploy site"

### Vercel (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "Add New Project"
4. Import your GitHub repository
5. Deploy settings:
   - Framework Preset: Other
   - Build command: (leave empty)
   - Output directory: (root directory)
6. Click "Deploy"

## Security Notes

- Passwords are stored in localStorage (not suitable for sensitive data)
- For production use with real security, consider adding a backend
- Always use HTTPS in production
- Be cautious with storing sensitive information in browser storage

## Features Overview

### Dashboard
- Modern, responsive design
- Dark mode by default with purple accent
- Sidebar navigation
- Global search bar
- Quick stats widgets

### Tools

**Calculator**
- Basic arithmetic operations
- Clear and equals functionality
- Real-time display

**Password Manager**
- Store website, username, password, notes
- Local storage persistence
- Delete functionality
- (Note: For production use, consider adding encryption)

**Notes**
- Create, edit, delete notes
- Auto-save to localStorage
- Date tracking
- Character limit preview

**Calendar**
- Monthly view
- Navigate between months
- Visual date grid

**Tasks (To-Do List)**
- Add, delete, complete tasks
- Visual completion status
- Local storage persistence

**Weather**
- City search
- Mock weather data (API integration needed for real data)
- Temperature, humidity, wind display

**Clock**
- Real-time clock display
- Stopwatch and timer placeholders

**QR Code Generator**
- Text/URL input
- Placeholder for QR generation (library needed for actual QR codes)

**Password Generator**
- Customizable length (8-128 characters)
- Uppercase, lowercase, numbers, symbols options
- Copy to clipboard

**Unit Converter**
- Length, weight, temperature conversions
- Multiple unit options
- Real-time conversion

**Currency Converter**
- Multiple currency support
- Mock exchange rates (API needed for live rates)

**Text Tools**
- Character and word counter
- Case converter (upper, lower, title, sentence)
- Remove duplicate lines
- Sort lines

**Random Generator**
- Random numbers (custom range)
- UUID generator
- Random color generator (HEX)

## License

MIT
