export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  unit: string;
}

export interface ForecastData {
  day: string;
  date: string;
  tempHigh: number;
  tempLow: number;
  description: string;
  icon: string;
  humidity: number;
  unit: string;
}
