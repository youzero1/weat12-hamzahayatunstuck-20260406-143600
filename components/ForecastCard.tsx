import { ForecastData } from '@/types/weather';
import { getWeatherIcon, getUnitSymbol } from '@/lib/weatherUtils';

interface Props {
  data: ForecastData;
  unit: string;
}

export default function ForecastCard({ data, unit }: Props) {
  const icon = getWeatherIcon(data.icon);
  const unitSymbol = getUnitSymbol(unit);

  return (
    <div className="forecast-card">
      <div className="forecast-day">{data.day}</div>
      <div className="forecast-icon">{icon}</div>
      <div className="forecast-temp-high">{data.tempHigh}{unitSymbol}</div>
      <div className="forecast-temp-low">{data.tempLow}{unitSymbol}</div>
      <div className="forecast-desc">{data.description}</div>
    </div>
  );
}
