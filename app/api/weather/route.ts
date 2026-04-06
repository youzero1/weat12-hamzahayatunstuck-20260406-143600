import { NextRequest, NextResponse } from 'next/server';
import { WeatherData, ForecastData } from '@/types/weather';
import { getWeatherIcon, getDayName } from '@/lib/weatherUtils';

const API_KEY = process.env.OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getMockWeather(city: string, unit: string): { current: WeatherData; forecast: ForecastData[] } {
  const tempBase = unit === 'metric' ? 22 : 72;
  const current: WeatherData = {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: 'US',
    temperature: tempBase,
    feelsLike: tempBase - 2,
    description: 'clear sky',
    icon: '01d',
    humidity: 60,
    windSpeed: 5.5,
    pressure: 1013,
    visibility: 10000,
    unit,
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const forecast: ForecastData[] = days.map((day, i) => ({
    day,
    date: new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString(),
    tempHigh: tempBase + Math.round(Math.random() * 6 - 3),
    tempLow: tempBase - 5 + Math.round(Math.random() * 4 - 2),
    description: ['clear sky', 'few clouds', 'scattered clouds', 'light rain', 'sunny'][i % 5],
    icon: ['01d', '02d', '03d', '10d', '01d'][i % 5],
    humidity: 55 + i * 3,
    unit,
  }));

  return { current, forecast };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const unit = searchParams.get('unit') || 'metric';

  if (!city) {
    return NextResponse.json({ error: 'City is required' }, { status: 400 });
  }

  if (API_KEY === 'demo') {
    const mockData = getMockWeather(city, unit);
    return NextResponse.json(mockData);
  }

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`),
      fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}&cnt=40`),
    ]);

    if (!weatherRes.ok) {
      const errData = await weatherRes.json();
      return NextResponse.json(
        { error: errData.message || 'City not found' },
        { status: weatherRes.status }
      );
    }

    const weatherJson = await weatherRes.json();
    const forecastJson = await forecastRes.json();

    const current: WeatherData = {
      city: weatherJson.name,
      country: weatherJson.sys.country,
      temperature: Math.round(weatherJson.main.temp),
      feelsLike: Math.round(weatherJson.main.feels_like),
      description: weatherJson.weather[0].description,
      icon: weatherJson.weather[0].icon,
      humidity: weatherJson.main.humidity,
      windSpeed: weatherJson.wind.speed,
      pressure: weatherJson.main.pressure,
      visibility: weatherJson.visibility,
      unit,
    };

    const dailyMap = new Map<string, ForecastData>();
    for (const item of forecastJson.list) {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          day: getDayName(date),
          date: date.toLocaleDateString(),
          tempHigh: Math.round(item.main.temp_max),
          tempLow: Math.round(item.main.temp_min),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          unit,
        });
      }
    }

    const todayKey = new Date().toDateString();
    dailyMap.delete(todayKey);
    const forecast = Array.from(dailyMap.values()).slice(0, 5);

    return NextResponse.json({ current, forecast });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
