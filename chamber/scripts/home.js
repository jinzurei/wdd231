// ─── OpenWeatherMap config ───────────────────────────────────────────────────
// Replace the value below with your own free API key from openweathermap.org
const OWM_API_KEY = '2df33f32fec4cc16a5cb90f232b67793';
const OWM_LAT     = 40.7608;   // Salt Lake City
const OWM_LON     = -111.8910;
const OWM_UNITS   = 'imperial';

// ─── Weather ─────────────────────────────────────────────────────────────────
async function loadWeather() {
  const section = document.getElementById('weatherSection');
  if (!section) return;

  if (OWM_API_KEY === 'YOUR_OWM_API_KEY') {
    section.innerHTML = '<p class="weather-error">Add your OpenWeatherMap API key in <code>scripts/home.js</code> to display live weather.</p>';
    return;
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${OWM_LAT}&lon=${OWM_LON}&appid=${OWM_API_KEY}&units=${OWM_UNITS}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${OWM_LAT}&lon=${OWM_LON}&appid=${OWM_API_KEY}&units=${OWM_UNITS}`)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      const errBody = await (currentRes.ok ? forecastRes : currentRes).json();
      throw new Error(`${currentRes.status}/${forecastRes.status}: ${errBody.message || 'fetch failed'}`);
    }

    const current  = await currentRes.json();
    const forecast = await forecastRes.json();

    renderCurrent(current);
    renderForecast(forecast);
  } catch (err) {
    section.innerHTML = `<p class="weather-error">Unable to load weather data. Please try again later.</p>`;
  }
}

function renderCurrent(data) {
  const temp        = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon        = data.weather[0].icon;
  const humidity    = data.main.humidity;
  const windSpeed   = Math.round(data.wind.speed);

  document.getElementById('weatherCurrent').innerHTML = `
    <img
      src="https://openweathermap.org/img/wn/${icon}@2x.png"
      alt="${description}"
      class="weather-icon"
      width="80"
      height="80"
    >
    <div class="weather-now-details">
      <p class="weather-temp">${temp}&deg;F</p>
      <p class="weather-desc">${capitalizeWords(description)}</p>
      <p class="weather-meta">Humidity: ${humidity}% &bull; Wind: ${windSpeed} mph</p>
    </div>
  `;
}

function renderForecast(data) {
  // Pick one reading per day (nearest to noon) for the next 3 days
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const byDay = {};

  for (const item of data.list) {
    const date = item.dt_txt.split(' ')[0];
    if (date === today) continue;
    if (Object.keys(byDay).length >= 3 && !byDay[date]) continue;

    if (!byDay[date]) {
      byDay[date] = item;
    } else {
      // prefer the reading closest to 12:00
      const currentHour  = parseInt(byDay[date].dt_txt.split(' ')[1]);
      const candidateHour = parseInt(item.dt_txt.split(' ')[1]);
      if (Math.abs(candidateHour - 12) < Math.abs(currentHour - 12)) {
        byDay[date] = item;
      }
    }
  }

  const days = Object.values(byDay).slice(0, 3);
  const container = document.getElementById('weatherForecast');

  container.innerHTML = days.map(item => {
    const date  = new Date(item.dt * 1000);
    const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const temp  = Math.round(item.main.temp);
    const icon  = item.weather[0].icon;
    const desc  = item.weather[0].description;
    return `
      <div class="forecast-day">
        <p class="forecast-label">${label}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" width="50" height="50">
        <p class="forecast-temp">${temp}&deg;F</p>
        <p class="forecast-desc">${capitalizeWords(desc)}</p>
      </div>
    `;
  }).join('');
}

// ─── Spotlights ──────────────────────────────────────────────────────────────
async function loadSpotlights() {
  const container = document.getElementById('spotlightsContainer');
  if (!container) return;

  try {
    const res  = await fetch('data/members.json');
    if (!res.ok) throw new Error('Members fetch failed');
    const data = await res.json();

    // Filter gold (3) and silver (2) members
    const eligible = data.members.filter(m => m.membershipLevel >= 2);

    // Shuffle and pick 2 or 3
    const shuffled = eligible.sort(() => Math.random() - 0.5);
    const count    = shuffled.length >= 3 ? 3 : 2;
    const picks    = shuffled.slice(0, count);

    container.innerHTML = picks.map(m => {
      const levelLabel = m.membershipLevel === 3 ? 'Gold' : 'Silver';
      const badgeClass = m.membershipLevel === 3 ? 'badge-gold' : 'badge-silver';
      return `
        <article class="spotlight-card">
          <div class="spotlight-img-wrap">
            <img src="images/${m.image}" alt="${m.name} logo" loading="lazy" width="160" height="80">
          </div>
          <div class="spotlight-body">
            <h3 class="spotlight-name">${m.name}</h3>
            <span class="card-badge ${badgeClass}">${levelLabel} Member</span>
            <p class="spotlight-detail">${m.phone}</p>
            <p class="spotlight-detail">${m.address}</p>
            <a class="spotlight-link" href="${m.website}" target="_blank" rel="noopener noreferrer">${m.websiteLabel}</a>
          </div>
        </article>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<p>Unable to load member spotlights.</p>';
  }
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Init ────────────────────────────────────────────────────────────────────
loadWeather();
loadSpotlights();
