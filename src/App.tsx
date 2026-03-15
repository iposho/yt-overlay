import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Layout,
  Palette,
  Share2,
  Trophy,
  Music,
  Clock,
  Bell,
  ExternalLink,
  Twitter,
  Instagram,
  Zap,
  ImageIcon,
  CloudSun,
  Wind,
  Sunrise,
  Sunset,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Snowflake,
  Droplets,
} from 'lucide-react';
import { OverlayState, SocketMessage, AlertData } from './types';

// --- Brand Logo Component ---
const BrandLogo = ({
  logoUrl,
  maxWidth = '80px',
  opacity = 1,
  showText = true,
  fontSize = 1.8,
}: {
  logoUrl: string;
  maxWidth: string;
  opacity?: number;
  showText?: boolean;
  fontSize?: number;
}) => (
  <div className="brand-logo" style={{ opacity }}>
    <div className="bird-icon" style={{ maxWidth }}>
      <img src={logoUrl} alt="Logo" referrerPolicy="no-referrer" />
    </div>
    {showText && (
      <div className="brand-text" style={{ fontSize: `${fontSize}rem` }}>
        <span>KENTRON</span>
        <span>BIRD</span>
        <span>WATCH TV</span>
      </div>
    )}
  </div>
);

// --- Dashboard Components ---

const Dashboard = ({
  state,
  onUpdate,
  onTriggerAlert,
}: {
  state: OverlayState;
  onUpdate: (newState: Partial<OverlayState>) => void;
  onTriggerAlert: (type: 'SUB' | 'DONATION', name: string, amount?: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'widgets' | 'theme'>('general');

  const updateWidget = <K extends keyof OverlayState['widgets']>(
    key: K,
    value: Partial<OverlayState['widgets'][K]>,
  ) => {
    onUpdate({
      widgets: {
        ...state.widgets,
        [key]: { ...state.widgets[key], ...value },
      },
    });
  };

  const updateTheme = (key: keyof OverlayState['theme'], value: string) => {
    onUpdate({
      theme: {
        ...state.theme,
        [key]: value,
      },
    });
  };

  return (
    <div className="dashboard-container">
      <div className="max-width-wrapper">
        <header className="dashboard-header">
          <div className="brand">
            <div className="live-indicator">
              <div className="dot" />
              <span>Live Control Panel</span>
            </div>
            <h1>yt-overlay</h1>
          </div>
          <div className="header-actions">
            <a href="/?view=overlay" target="_blank" className="btn-primary">
              Open Overlay <ExternalLink size={16} />
            </a>
          </div>
        </header>

        <div className="dashboard-layout">
          <nav className="sidebar-nav">
            <button
              onClick={() => setActiveTab('general')}
              className={`nav-item ${activeTab === 'general' ? 'active' : ''}`}
            >
              <Settings size={18} /> General
            </button>
            <button
              onClick={() => setActiveTab('widgets')}
              className={`nav-item ${activeTab === 'widgets' ? 'active' : ''}`}
            >
              <Layout size={18} /> Widgets
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`nav-item ${activeTab === 'theme' ? 'active' : ''}`}
            >
              <Palette size={18} /> Theme
            </button>

            <div className="nav-divider">
              <h3>Quick Actions</h3>
              <button
                onClick={() => onTriggerAlert('SUB', 'NewSubscriber')}
                className="action-btn emerald"
              >
                <Zap size={18} /> Test Sub Alert
              </button>
              <button
                onClick={() => onTriggerAlert('DONATION', 'GenerousUser', '$100.00')}
                className="action-btn amber"
              >
                <Bell size={18} /> Test Donation
              </button>
            </div>
          </nav>

          <main>
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <section className="content-section">
                  <h2>
                    <ImageIcon size={20} /> Channel Logo
                  </h2>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Logo URL</label>
                      <div className="input-wrapper">
                        <ImageIcon className="icon" size={16} />
                        <input
                          type="text"
                          value={state.widgets.logo.url}
                          onChange={(e) => updateWidget('logo', { url: e.target.value })}
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Max Width (px/%)</label>
                      <div className="input-wrapper no-icon">
                        <input
                          type="text"
                          value={state.widgets.logo.maxWidth}
                          onChange={(e) => updateWidget('logo', { maxWidth: e.target.value })}
                          placeholder="200px"
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Opacity ({Math.round(state.widgets.logo.opacity * 100)}%)</label>
                      <div className="input-wrapper no-icon">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={state.widgets.logo.opacity}
                          onChange={(e) =>
                            updateWidget('logo', {
                              opacity: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <div className="toggle-row">
                        <span>Show Logo</span>
                        <button
                          onClick={() =>
                            updateWidget('logo', { enabled: !state.widgets.logo.enabled })
                          }
                          className={`toggle-btn ${state.widgets.logo.enabled ? 'on' : 'off'}`}
                        >
                          <div className="knob" />
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <div className="toggle-row">
                        <span>Show Logo Text</span>
                        <button
                          onClick={() =>
                            updateWidget('logoText', { enabled: !state.widgets.logoText?.enabled })
                          }
                          className={`toggle-btn ${state.widgets.logoText?.enabled ? 'on' : 'off'}`}
                        >
                          <div className="knob" />
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>
                        Text Size ({((state.widgets.logoText?.fontSize ?? 1.8) * 100).toFixed(0)}%)
                      </label>
                      <div className="input-wrapper no-icon">
                        <input
                          type="range"
                          min="0.5"
                          max="4"
                          step="0.05"
                          value={state.widgets.logoText?.fontSize ?? 1.8}
                          onChange={(e) =>
                            updateWidget('logoText', {
                              fontSize: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {window.location.hostname === 'localhost' && (
                  <section className="content-section debug-section">
                    <h2 style={{ color: '#ef4444' }}>
                      <Settings size={20} /> Debug Mode (Local Only)
                    </h2>
                    <div className="toggle-row">
                      <span>Show Debug Background</span>
                      <button
                        onClick={() =>
                          updateWidget('debug', { enabled: !state.widgets.debug.enabled })
                        }
                        className={`toggle-btn ${state.widgets.debug.enabled ? 'on' : 'off'}`}
                      >
                        <div className="knob" />
                      </button>
                    </div>
                    <div className="input-group">
                      <label>Background Image URL</label>
                      <div className="input-wrapper">
                        <ImageIcon className="icon" size={16} />
                        <input
                          type="text"
                          value={state.widgets.debug.backgroundUrl}
                          onChange={(e) => updateWidget('debug', { backgroundUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </section>
                )}

                <section className="content-section">
                  <h2>
                    <Share2 size={20} /> Social Media
                  </h2>
                  <div className="toggle-row">
                    <span>Enable Socials</span>
                    <button
                      onClick={() =>
                        updateWidget('socials', { enabled: !state.widgets.socials.enabled })
                      }
                      className={`toggle-btn ${state.widgets.socials.enabled ? 'on' : 'off'}`}
                    >
                      <div className="knob" />
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Twitter Handle</label>
                      <div className="input-wrapper">
                        <Twitter className="icon" size={16} />
                        <input
                          type="text"
                          value={state.widgets.socials.twitter}
                          onChange={(e) => updateWidget('socials', { twitter: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Instagram</label>
                      <div className="input-wrapper">
                        <Instagram className="icon" size={16} />
                        <input
                          type="text"
                          value={state.widgets.socials.instagram}
                          onChange={(e) => updateWidget('socials', { instagram: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'widgets' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <section className="content-section">
                  <h2>
                    <Trophy size={20} /> Sub Goal
                  </h2>
                  <div className="toggle-row">
                    <span>Enable Sub Goal</span>
                    <button
                      onClick={() => updateWidget('goal', { enabled: !state.widgets.goal.enabled })}
                      className={`toggle-btn ${state.widgets.goal.enabled ? 'on' : 'off'}`}
                    >
                      <div className="knob" />
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Goal Title</label>
                      <div className="input-wrapper no-icon">
                        <input
                          type="text"
                          value={state.widgets.goal.title}
                          onChange={(e) => updateWidget('goal', { title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-grid tight">
                      <div className="input-group">
                        <label>Current</label>
                        <div className="input-wrapper no-icon">
                          <input
                            type="number"
                            value={state.widgets.goal.current}
                            onChange={(e) =>
                              updateWidget('goal', { current: parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Target</label>
                        <div className="input-wrapper no-icon">
                          <input
                            type="number"
                            value={state.widgets.goal.target}
                            onChange={(e) =>
                              updateWidget('goal', { target: parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="content-section">
                  <h2>
                    <Clock size={20} /> Clock
                  </h2>
                  <div className="toggle-row">
                    <span>Show Clock</span>
                    <button
                      onClick={() =>
                        updateWidget('clock', { enabled: !state.widgets.clock.enabled })
                      }
                      className={`toggle-btn ${state.widgets.clock.enabled ? 'on' : 'off'}`}
                    >
                      <div className="knob" />
                    </button>
                  </div>
                </section>

                <section className="content-section">
                  <h2>
                    <CloudSun size={20} /> Weather
                  </h2>
                  <div className="toggle-row">
                    <span>Enable Weather</span>
                    <button
                      onClick={() =>
                        updateWidget('weather', { enabled: !state.widgets.weather.enabled })
                      }
                      className={`toggle-btn ${state.widgets.weather.enabled ? 'on' : 'off'}`}
                    >
                      <div className="knob" />
                    </button>
                  </div>

                  <div className="input-group">
                    <label>Location</label>
                    <div className="input-wrapper">
                      <CloudSun className="icon" size={16} />
                      <input
                        type="text"
                        value={state.widgets.weather.location}
                        onChange={(e) => updateWidget('weather', { location: e.target.value })}
                        placeholder="Yerevan"
                      />
                    </div>
                  </div>
                </section>

                <section className="content-section">
                  <h2>
                    <Music size={20} /> Now Playing
                  </h2>
                  <div className="toggle-row">
                    <span>Enable Widget</span>
                    <button
                      onClick={() =>
                        updateWidget('nowPlaying', { enabled: !state.widgets.nowPlaying.enabled })
                      }
                      className={`toggle-btn ${state.widgets.nowPlaying.enabled ? 'on' : 'off'}`}
                    >
                      <div className="knob" />
                    </button>
                  </div>
                  <div className="input-group">
                    <div className="input-wrapper no-icon">
                      <input
                        type="text"
                        value={state.widgets.nowPlaying.text}
                        onChange={(e) => updateWidget('nowPlaying', { text: e.target.value })}
                        placeholder="Song title..."
                      />
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'theme' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <section className="content-section">
                  <h2>
                    <Palette size={20} /> Color Palette
                  </h2>
                  <div className="form-grid">
                    <div className="input-group">
                      <div className="toggle-row">
                        <label>Primary Color</label>
                        <div className="input-wrapper no-icon">
                          <input
                            type="color"
                            value={state.theme.primary}
                            onChange={(e) => updateTheme('primary', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="input-group">
                      <div className="toggle-row">
                        <label>Accent Color</label>
                        <div className="input-wrapper no-icon">
                          <input
                            type="color"
                            value={state.theme.accent}
                            onChange={(e) => updateTheme('accent', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// --- Weather Helpers ---

const AnimatedWeatherIcon = ({ code }: { code: number }) => {
  // Clear sky
  if (code === 0) {
    return (
      <div className="weather-icon-animated sunny">
        <Sun className="sun-icon" />
        <div className="sun-rays">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="ray" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>
    );
  }

  // Partly cloudy
  if (code <= 3) {
    return (
      <div className="weather-icon-animated partly-cloudy">
        <Sun className="sun-icon small" />
        <Cloud className="cloud-icon" />
      </div>
    );
  }

  // Fog
  if (code <= 48) {
    return (
      <div className="weather-icon-animated foggy">
        <CloudFog className="fog-icon" />
        <div className="fog-lines">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="fog-line" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>
    );
  }

  // Drizzle & Rain
  if (code <= 67) {
    const isHeavy = code >= 63;
    return (
      <div className={`weather-icon-animated rainy ${isHeavy ? 'heavy' : ''}`}>
        {isHeavy ? <CloudRain className="cloud-icon" /> : <CloudDrizzle className="cloud-icon" />}
        <div className="rain-drops">
          {[...Array(isHeavy ? 6 : 4)].map((_, i) => (
            <Droplets key={i} className="drop" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>
    );
  }

  // Snow
  if (code <= 77) {
    return (
      <div className="weather-icon-animated snowy">
        <CloudSnow className="cloud-icon" />
        <div className="snowflakes">
          {[...Array(5)].map((_, i) => (
            <Snowflake key={i} className="flake" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>
    );
  }

  // Rain showers
  if (code <= 86) {
    return (
      <div className="weather-icon-animated showers">
        <CloudRain className="cloud-icon" />
        <div className="rain-drops intense">
          {[...Array(5)].map((_, i) => (
            <Droplets key={i} className="drop" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>
    );
  }

  // Thunderstorm
  if (code <= 99) {
    return (
      <div className="weather-icon-animated stormy">
        <CloudLightning className="cloud-icon" />
        <div className="lightning-bolt">
          <Zap className="bolt" />
        </div>
        <div className="rain-drops">
          {[...Array(4)].map((_, i) => (
            <Droplets key={i} className="drop" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>
    );
  }

  // Default
  return (
    <div className="weather-icon-animated default">
      <Cloud className="cloud-icon" />
    </div>
  );
};

const getWeatherIcon = (code: number) => {
  return <AnimatedWeatherIcon code={code} />;
};

const getWindDirection = (degree: number | undefined) => {
  if (degree === undefined) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degree / 45) % 8];
};

const getAqiText = (index: number | undefined) => {
  if (index === undefined) return '';
  const labels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor', 'Hazardous'];
  return labels[index] || 'Hazardous';
};

const WeatherView = ({
  weatherData,
  getWeatherIcon,
}: {
  weatherData: {
    temp?: number;
    code?: number;
    windSpeed?: number;
    windDegree?: number;
    aqi?: number;
    sunrise?: string;
    sunset?: string;
  };
  getWeatherIcon: (code: number) => React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const weatherTabs = [
    {
      label: 'Wind',
      icon: <Wind size={20} />,
      value: `${weatherData.windSpeed !== undefined ? Math.round(weatherData.windSpeed) : 0} m/s ${getWindDirection(weatherData.windDegree)}`,
    },
    {
      label: 'Air Quality',
      icon: <Wind size={20} className="rotate-90" />,
      value: getAqiText(weatherData.aqi),
    },
    {
      label: 'Sunrise',
      icon: <Sunrise size={20} />,
      value: weatherData.sunrise,
    },
    {
      label: 'Sunset',
      icon: <Sunset size={20} />,
      value: weatherData.sunset,
    },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="overlay-widget weather-widget modern-minimal"
    >
      <div className="weather-header">
        <span className="weather-icon">{getWeatherIcon(weatherData.code || 0)}</span>
        <span className="temp">
          {(weatherData.temp || 0) > 0 ? `+${weatherData.temp || 0}` : `${weatherData.temp || 0}`}°
        </span>
      </div>

      <div className="weather-info-box">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="info-block"
          >
            <div className="info-icon">{weatherTabs[activeTab].icon}</div>
            <div className="info-content">
              <span className="info-label">{weatherTabs[activeTab].label}</span>
              <span className="info-value">{weatherTabs[activeTab].value}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="info-dots">
          {weatherTabs.map((_, i) => (
            <div key={i} className={`dot ${activeTab === i ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Overlay Components ---

const Overlay = ({ state, alert }: { state: OverlayState; alert: AlertData | null }) => {
  const [time, setTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    code: number;
    humidity?: number;
    windSpeed?: number;
    windDegree?: number;
    aqi?: number;
    sunrise?: string;
    sunset?: string;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!state.widgets.weather.enabled) return;

    const fetchWeather = async () => {
      try {
        // First geocode the location (using a simple search or hardcoded coords for Yerevan if search fails)
        // For simplicity and reliability in this demo, let's use a public geocoding API or default to Yerevan
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(state.widgets.weather.location)}&count=1&language=en&format=json`,
        );
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&daily=sunrise,sunset&timezone=auto`,
          );
          const weatherJson = await weatherRes.json();

          const aqiRes = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi`,
          );
          const aqiJson = await aqiRes.json();

          if (weatherJson.current) {
            const current = weatherJson.current;
            const daily = weatherJson.daily;
            setWeatherData({
              temp: Math.round(current.temperature_2m ?? 0),
              code: current.weather_code ?? 0,
              humidity: current.relative_humidity_2m,
              windSpeed: current.wind_speed_10m ?? 0,
              windDegree: current.wind_direction_10m ?? 0,
              aqi: aqiJson?.current?.european_aqi,
              sunrise: daily?.sunrise?.[0]?.split('T')[1],
              sunset: daily?.sunset?.[0]?.split('T')[1],
            });
          }
        }
      } catch (e) {
        console.error('Weather fetch error:', e);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 mins
    return () => clearInterval(interval);
  }, [state.widgets.weather.location, state.widgets.weather.enabled]);

  const progress = (state.widgets.goal.current / state.widgets.goal.target) * 100;
  return (
    <div className="overlay-container">
      {/* Debug Background */}
      {state.widgets.debug?.enabled && (
        <div
          className="debug-background"
          style={{ backgroundImage: `url(${state.widgets.debug.backgroundUrl})` }}
        />
      )}

      {/* Logo */}
      <AnimatePresence>
        {state.widgets.logo.enabled && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="logo-widget"
          >
            <BrandLogo
              logoUrl={state.widgets.logo.url}
              maxWidth={state.widgets.logo.maxWidth || '80px'}
              opacity={state.widgets.logo.opacity ?? 1}
              showText={state.widgets.logoText?.enabled ?? true}
              fontSize={state.widgets.logoText?.fontSize ?? 1.8}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Socials */}
      <AnimatePresence>
        {state.widgets.socials.enabled && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="socials-stack"
          >
            <div className="overlay-widget">
              <Twitter size={16} style={{ color: state.theme.primary }} />
              <span style={{ color: state.theme.text, fontWeight: 700 }}>
                {state.widgets.socials.twitter}
              </span>
            </div>
            <div className="overlay-widget">
              <Instagram size={16} style={{ color: state.theme.primary }} />
              <span style={{ color: state.theme.text, fontWeight: 700 }}>
                {state.widgets.socials.instagram}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clock */}
      <AnimatePresence>
        {state.widgets.clock.enabled && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="overlay-widget clock-widget broadcast-live"
          >
            <div className="time-display">
              {time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
            <div className="live-badge">LIVE</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather */}
      <AnimatePresence>
        {state.widgets.weather.enabled && weatherData && (
          <WeatherView weatherData={weatherData} getWeatherIcon={getWeatherIcon} />
        )}
      </AnimatePresence>
      {/* Goal */}
      <AnimatePresence>
        {state.widgets.goal.enabled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="overlay-widget goal-widget"
          >
            <div className="goal-header">
              <span className="title" style={{ color: state.theme.text }}>
                {state.widgets.goal.title}
              </span>
              <span className="stats" style={{ color: state.theme.text }}>
                {state.widgets.goal.current} / {state.widgets.goal.target}
              </span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="fill"
                style={{ backgroundColor: state.theme.primary }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Now Playing */}
      <AnimatePresence>
        {state.widgets.nowPlaying.enabled && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="overlay-widget now-playing-widget"
          >
            <div className="music-icon" style={{ backgroundColor: state.theme.primary + '20' }}>
              <Music size={20} style={{ color: state.theme.primary }} />
            </div>
            <div className="track-info">
              <div className="label" style={{ color: state.theme.text }}>
                Now Playing
              </div>
              <div className="text" style={{ color: state.theme.text }}>
                {state.widgets.nowPlaying.text}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            className="alert-box"
          >
            <div className="alert-icon">
              {alert.type === 'SUB' ? (
                <Zap size={40} color="white" />
              ) : (
                <Bell size={40} color="white" />
              )}
            </div>
            <div className="alert-text">
              <h2>{alert.type === 'SUB' ? 'New Subscriber!' : 'New Donation!'}</h2>
              <p>
                {alert.name} {alert.amount && <span className="amount">{alert.amount}</span>}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<OverlayState | null>(null);
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [view] = useState<'dashboard' | 'overlay'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'overlay' ? 'overlay' : 'dashboard';
  });

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data: SocketMessage = JSON.parse(event.data);
      if (data.type === 'INIT') {
        setState(data.state);
      } else if (data.type === 'STATE_UPDATED') {
        setState(data.state);
      } else if (data.type === 'ALERT') {
        setCurrentAlert(data.alert);
        setTimeout(() => setCurrentAlert(null), 5000);
      }
    };

    return () => socket.close();
  }, []);

  const handleUpdate = (newState: Partial<OverlayState>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'UPDATE_STATE', state: newState }));
    }
  };

  const handleTriggerAlert = (type: 'SUB' | 'DONATION', name: string, amount?: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: 'TRIGGER_ALERT', alert: { type, name, amount } }),
      );
    }
  };

  if (!state) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#52525b', fontFamily: 'monospace', letterSpacing: '0.2em' }}>
          LOADING YT-OVERLAY...
        </p>
      </div>
    );
  }

  return (
    <>
      {view === 'dashboard' ? (
        <Dashboard state={state} onUpdate={handleUpdate} onTriggerAlert={handleTriggerAlert} />
      ) : (
        <Overlay state={state} alert={currentAlert} />
      )}
    </>
  );
}
