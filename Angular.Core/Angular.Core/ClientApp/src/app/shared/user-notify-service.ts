import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserNotifyService {

  constructor(private toastr: ToastrService) {
    
  }

  notifyUser(msg: string) {
    this.toastr.warning(msg);
  }

}
