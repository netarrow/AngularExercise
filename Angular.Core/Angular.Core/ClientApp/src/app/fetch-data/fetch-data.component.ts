import { Component, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddForecastContent } from '../shared/AddForecastContent';
import { WeatherForecast, WeatherForecastService } from './weather-forecast-service.service';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'

})
export class FetchDataComponent {
  public forecasts: WeatherForecast[];

  constructor(private modalService: NgbModal, private service: WeatherForecastService) {
    service.getForecast().subscribe(data => this.forecasts = data);
  }

  openEditForm(forecastToEdit: WeatherForecast) {
    const modalRef = this.modalService.open(AddForecastContent, { ariaLabelledBy: 'modal-basic-title' });
    modalRef.componentInstance.title = 'Edit Forecast';
    modalRef.componentInstance.setupForEdit(forecastToEdit);

    modalRef.result.then((result) => {
      this.service.getForecast().subscribe(data => this.forecasts = data);
    }, reason => console.log(reason));
  }

  openNewForecast() {
    const modalRef = this.modalService.open(AddForecastContent, { ariaLabelledBy: 'modal-basic-title' });

    modalRef.componentInstance.title = 'Add Forecast';

    modalRef.result.then((result) => {
          result.data.glowing = true;
          this.forecasts.push(result.data);
    }, reason => console.log(reason));
  }
}
