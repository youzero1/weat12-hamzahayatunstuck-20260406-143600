import { ForecastData } from '@/types/weather';
import ForecastCard from './ForecastCard';

interface Props {
  forecast: ForecastData[];
  unit: string;
}

export default function ForecastSection({ forecast, unit }: Props) {
  return (
    <div className="weather-card">
      <h2 className="forecast-title">5-Day Forecast</h2>
      <div className="forecast-grid">
        {forecast.map((item, index) => (
          <ForecastCard key={index} data={item} unit={unit} />
        ))}
      </div>
    </div>
  );
}
