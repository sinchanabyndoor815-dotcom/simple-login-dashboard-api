// Demo credentials (for assignment purposes)
const demoCredentials = {
    username: 'admin',
    password: 'password123'
};

// Page management
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const welcomeMessage = document.getElementById('welcomeMessage');
const logoutBtn = document.getElementById('logoutBtn');

// Login form validation and submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    let isValid = true;
    
    if (!username) {
        showError('usernameError', 'Username is required');
        isValid = false;
    }
    
    if (!password) {
        showError('passwordError', 'Password is required');
        isValid = false;
    }
    
    if (isValid) {
        // Demo login (always succeed for assignment)
        localStorage.setItem('loggedInUser', username);
        showDashboard(username);
        fetchApiData();
    }
});

function showError(errorId, message) {
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

function showDashboard(username) {
    welcomeMessage.textContent = `Welcome, ${username}!`;
    loginPage.classList.remove('active');
    dashboardPage.classList.add('active');
}

function showLogin() {
    localStorage.removeItem('loggedInUser');
    loginPage.classList.add('active');
    dashboardPage.classList.remove('active');
    loginForm.reset();
    clearErrors();
}

// Logout functionality
logoutBtn.addEventListener('click', showLogin);

// Check if already logged in
const loggedInUser = localStorage.getItem('loggedInUser');
if (loggedInUser) {
    showDashboard(loggedInUser);
    fetchApiData();
}

// Fetch data from various public APIs
async function fetchApiData() {
    try {
        // Fetch news from Spaceflight News API (public, no key required)
        const newsResponse = await fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=3');
        const news = await newsResponse.json();
        
        // Fetch weather from Open-Meteo (public, no key required)
        const weatherResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current_weather=true'); // Bangalore coordinates
        const weather = await weatherResponse.json();
        
        // Fetch location from IP-API (public, no key required)
        const locationResponse = await fetch('https://ipapi.co/json/');
        const location = await locationResponse.json();
        
        // Update stats
        document.getElementById('newsData').textContent = news.length > 0 ? news[0].title.substring(0, 20) + '...' : 'No news';
        document.getElementById('weatherData').textContent = `${weather.current_weather.temperature}°C`;
        document.getElementById('locationData').textContent = `${location.city}, ${location.country_name}`;
        
        // Display news articles
        displayApiData(news);
        
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to mock data if APIs fail
        const mockNews = [
            { id: 1, title: 'SpaceX Launches New Mission', summary: 'Elon Musk announces the latest rocket launch.' },
            { id: 2, title: 'NASA Discovers New Planet', summary: 'Scientists find an Earth-like planet in distant galaxy.' },
            { id: 3, title: 'Mars Rover Sends Photos', summary: 'New images from the red planet reveal interesting features.' }
        ];
        document.getElementById('newsData').textContent = mockNews[0].title.substring(0, 20) + '...';
        document.getElementById('weatherData').textContent = '25°C';
        document.getElementById('locationData').textContent = 'Bangalore, India';
        displayApiData(mockNews);
    }
}

function displayApiData(articles) {
    const apiDataContainer = document.getElementById('apiData');
    
    apiDataContainer.innerHTML = articles.map(article => `
        <div class="api-item">
            <h4>${article.title.substring(0, 50)}${article.title.length > 50 ? '...' : ''}</h4>
            <p>${article.summary ? article.summary.substring(0, 100) + (article.summary.length > 100 ? '...' : '') : 'No summary'}</p>
            <small>ID: ${article.id}</small>
        </div>
    `).join('');
}

