import { WeatherData } from '@/types/weather';
import { getWeatherIcon, formatVisibility, getUnitSymbol, getWindUnit } from '@/lib/weatherUtils';

interface Props {
  data: WeatherData;
  unit: string;
}

export default function CurrentWeather({ data, unit }: Props) {
  const icon = getWeatherIcon(data.icon);
  const unitSymbol = getUnitSymbol(unit);
  const windUnit = getWindUnit(unit);

  return (
    <div className="weather-card">
      <div className="city-name">{data.city}</div>
      <div className="country">{data.country}</div>

      <div className="current-temp-section">
        <div className="weather-icon">{icon}</div>
        <div>
          <div className="temperature">
            {data.temperature}{unitSymbol}
          </div>
          <div className="feels-like">Feels like {data.feelsLike}{unitSymbol}</div>
        </div>
      </div>

      <div className="description">{data.description}</div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-label">Humidity</div>
          <div className="detail-value">{data.humidity}%</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Wind Speed</div>
          <div className="detail-value">{data.windSpeed} {windUnit}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Pressure</div>
          <div className="detail-value">{data.pressure} hPa</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Visibility</div>
          <div className="detail-value">{formatVisibility(data.visibility)}</div>
        </div>
      </div>
    </div>
  );
}
