const timeZones = [
    { city: 'New York', timezone: 'America/New_York', flag: '🗽' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles', flag: '🌴' },
    { city: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
    { city: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🗾' },
    { city: 'Sydney', timezone: 'Australia/Sydney', flag: '🦘' },
    { city: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪' },
    { city: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
    { city: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰' },
    { city: 'Bangkok', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
    { city: 'Delhi', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
    { city: 'Moscow', timezone: 'Europe/Moscow', flag: '🇷🇺' }
];

function formatTime(date, timezone) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: timezone
    }).format(date);
}

function getTimezoneOffset(timezone) {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate - utcDate) / (1000 * 60 * 60);
    return offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
}

function createClockCard(location) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.innerHTML = `
        <div class="city-name">${location.flag} ${location.city}</div>
        <div class="time-display" id="time-${location.city}">--:--:--</div>
        <div class="timezone-info" id="tz-${location.city}">--</div>
    `;
    return card;
}

function updateClock() {
    const now = new Date();
    timeZones.forEach(location => {
        const timeElement = document.getElementById(`time-${location.city}`);
        const tzElement = document.getElementById(`tz-${location.city}`);
        
        if (timeElement) {
            timeElement.textContent = formatTime(now, location.timezone);
        }
        if (tzElement) {
            tzElement.textContent = getTimezoneOffset(location.timezone);
        }
    });
}

function initializeClock() {
    const clockGrid = document.getElementById('clockGrid');
    timeZones.forEach(location => {
        clockGrid.appendChild(createClockCard(location));
    });
    updateClock();
    setInterval(updateClock, 1000);
}

document.addEventListener('DOMContentLoaded', initializeClock);