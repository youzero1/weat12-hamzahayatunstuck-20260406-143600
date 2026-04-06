'use client';

import { useState, useCallback } from 'react';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastSection from '@/components/ForecastSection';
import { WeatherData, ForecastData } from '@/types/weather';

export default function Home() {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}&unit=${unit}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to fetch weather data');
        setWeather(null);
        setForecast([]);
      } else {
        setWeather(data.current);
        setForecast(data.forecast);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [city, unit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <main className="container">
      <h1 className="app-title">⛅ Weather App</h1>
      <p className="app-subtitle">Get real-time weather & 5-day forecast</p>

      <div className="unit-toggle">
        <button
          className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
          onClick={() => setUnit('metric')}
        >
          °C
        </button>
        <button
          className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
          onClick={() => setUnit('imperial')}
        >
          °F
        </button>
      </div>

      <div className="search-section">
        <input
          className="search-input"
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-btn" onClick={fetchWeather} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading && <p className="loading">Fetching weather data...</p>}

      {!loading && weather && (
        <>
          <CurrentWeather data={weather} unit={unit} />
          {forecast.length > 0 && <ForecastSection forecast={forecast} unit={unit} />}
        </>
      )}

      {!loading && !weather && !error && (
        <div className="placeholder">
          <div className="placeholder-icon">🌍</div>
          <p className="placeholder-text">Search for a city to see the weather</p>
        </div>
      )}
    </main>
  );
}
