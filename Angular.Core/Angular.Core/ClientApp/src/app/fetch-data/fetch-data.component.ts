import { Component, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddForecastContent } from '../shared/AddForecastContent';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { WeatherForecast, WeatherForecastService } from './weather-forecast-service.service';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'

})
export class FetchDataComponent {
  public forecasts: WeatherForecast[];
  form: FormGroup = new FormGroup({
      fileToUpload:new FormControl('')
  });

  currentFile: any;

  constructor(private modalService: NgbModal, private service: WeatherForecastService) {
    service.getForecast().subscribe(data => this.forecasts = data);
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      var file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(file);

        this.currentFile = file;

        this.form.patchValue({
          fileToUpload: reader.result
        });
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
