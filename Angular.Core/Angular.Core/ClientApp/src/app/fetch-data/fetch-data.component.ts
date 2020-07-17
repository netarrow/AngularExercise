import { Component, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddForecastContent } from './AddForecastContent';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { WeatherForecast, WeatherForecastService } from '../shared/weather-forecast-service.service';
import { UserNotifyService } from  "../shared/user-notify-service";

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'

})
export class FetchDataComponent {
  public forecasts: WeatherForecast[];

  currentFile: any;

  constructor(private modalService: NgbModal,
    private service: WeatherForecastService,
    private notify: UserNotifyService) {
    service.getForecast().subscribe(data => this.forecasts = data);
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      var file: File = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(file);

        if (file.type !== "image/png") {
          this.notify.notifyUser("Only images are supported");
          event.target.value = '';
        } else {

          this.currentFile = file;

        }
      };
    }
  }

  onSubmit() {
    const formData = new FormData();
    
    formData.append('file', this.currentFile);

    this.service.upload(formData).subscribe(response => alert(response));
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
