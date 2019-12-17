import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { NgbActiveModal, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { WeatherForecastService, WeatherForecast } from '../shared/weather-forecast-service.service';
import { d } from '@angular/core/src/render3';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: 'addForecastTemplate.html'
})
export class AddForecastContent {
  @Input() title;

  date: FormControl = new FormControl('', [Validators.required]);
  temperature: FormControl = new FormControl('', [Validators.required]);
  summary: FormControl = new FormControl('', [Validators.required]);

  isEdit: boolean;
  id: number;

  isInvalid: boolean = false;

  constructor(public activeModal: NgbActiveModal, private service: WeatherForecastService) {

  }

  setupForEdit(forecast: WeatherForecast) {
    const dates = forecast.dateFormatted.split('/');

    this.date.setValue({day: parseInt(dates[0], 10), month: parseInt(dates[1], 10), year: parseInt(dates[2], 10)});

    this.temperature.setValue(forecast.temperatureC);
    this.summary.setValue(forecast.summary);

    this.id = forecast.id;
    this.isEdit = true;
  }

  updateForecast() {
    this.isInvalid = (!this.date.valid || !this.temperature.valid || !this.summary.valid);

    if(this.isInvalid) { return; }

    const date: string = this.date.value.day + '/' + this.date.value.month + '/' + this.date.value.year;

    const updatedForecast: WeatherForecast = {
      dateFormatted: date,
      temperatureC: this.temperature.value,
      summary: this.summary.value,
      temperatureF: 0,
      glowing: false,
      id: this.id
     };

    this.service.updateForecast(updatedForecast).subscribe(result => this.activeModal.close({ status: 'ok update', data: result }));
  }

  saveForecast() {
    this.isInvalid = (!this.date.valid || !this.temperature.valid || !this.summary.valid);

    if(this.isInvalid) { return; }

    const date: string = this.date.value.day + '/' + this.date.value.month + '/' + this.date.value.year;

    const newForecast: WeatherForecast = {
      dateFormatted: date,
      temperatureC: this.temperature.value,
      summary: this.summary.value,
      temperatureF: 0,
      glowing: false,
      id: 0
     };

    this.service.addForecast(newForecast).subscribe(result => this.activeModal.close({ status: 'ok add', data: result }));

  }



}
