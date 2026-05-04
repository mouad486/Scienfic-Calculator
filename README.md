# 🌍 Digital Clock - Multiple Time Zones

A beautiful, responsive web application that displays the current time in 12 major cities around the world in real-time.

## Features

✨ **Real-time Updates** - Clock updates every second
🌍 **12 Global Cities** - New York, Los Angeles, London, Paris, Tokyo, Sydney, Dubai, Singapore, Hong Kong, Bangkok, Delhi, Moscow
📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop devices
🎨 **Modern UI** - Beautiful gradient background with card-based layout
🚀 **No Dependencies** - Pure vanilla JavaScript using the browser's Intl API
🕐 **12-hour Format** - Easy-to-read time display with AM/PM

## Supported Time Zones

- 🗽 New York (America/New_York)
- 🌴 Los Angeles (America/Los_Angeles)
- 🇬🇧 London (Europe/London)
- 🇫🇷 Paris (Europe/Paris)
- 🗾 Tokyo (Asia/Tokyo)
- 🦘 Sydney (Australia/Sydney)
- 🇦🇪 Dubai (Asia/Dubai)
- 🇸🇬 Singapore (Asia/Singapore)
- 🇭🇰 Hong Kong (Asia/Hong_Kong)
- 🇹🇭 Bangkok (Asia/Bangkok)
- 🇮🇳 Delhi (Asia/Kolkata)
- 🇷🇺 Moscow (Europe/Moscow)

## Getting Started

### Option 1: Local Development
1. Clone the repository
2. Navigate to the timezone-clock directory
3. Open `index.html` in your web browser

### Option 2: Live Preview
Simply open the files in any modern web browser. No build process or dependencies required!

## File Structure

```
├── index.html      # Main HTML file
├── styles.css      # Styling and responsive layout
├── script.js       # Clock logic and time zone handling
└── README.md       # This file
```

## How It Works

The application uses the browser's built-in `Intl.DateTimeFormat` API to:
1. Get the current date and time
2. Format it according to each time zone
3. Display the UTC offset for each location
4. Update every second with smooth animations

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 24+
- Firefox 29+
- Safari 10+
- Opera 15+

## Customization

### Add a New City
Edit the `timeZones` array in `script.js`:

```javascript
{ city: 'Your City', timezone: 'Continent/City', flag: '🏳️' }
```

### Change Colors
Update the gradient in `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change Update Frequency
Modify the interval in `script.js`:
```javascript
setInterval(updateClock, 1000); // 1000ms = 1 second
```

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Author

Created for the Scientific Calculator project repository.

---

**Enjoy tracking time around the world! 🌍⏰**
