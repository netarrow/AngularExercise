import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherForecastService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, ) {
  }

  updateForecast(updatedForecast: WeatherForecast): Observable<boolean> {
    return this.http.put<boolean>(this.baseUrl + 'api/SampleData/UpdateWeatherForecasts', updatedForecast);
  }

  addForecast(newForecast: WeatherForecast): Observable<WeatherForecast> {
    return this.http.post<WeatherForecast>(this.baseUrl + 'api/SampleData/AddWeatherForecasts', newForecast);
  }

   getForecast(): Observable<WeatherForecast[]> {
    return this.http.get<WeatherForecast[]>(this.baseUrl + 'api/SampleData/WeatherForecasts');
  }

}

export interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
  id: number;
  glowing: boolean;
}
