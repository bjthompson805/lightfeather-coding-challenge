import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public supervisors: any = [];
  public firstName: any = '';
  public lastName: any = '';
  public selectedSupervisor: any = '';
  public email: any = '';
  public phoneNumber: any = '';
  public successMessage: any = '';
  public errors: any = [];

  constructor(private httpClient: HttpClient) {
    this.httpClient.get<any>('/api/supervisors').subscribe(response => {
      this.supervisors = response.app_data;
    });
  }

  submitSupervisorSubscription() {
    this.successMessage = '';
    this.errors = [];

    this.httpClient.post<any>('/api/submit', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      supervisor: this.selectedSupervisor
    }).subscribe(response => {
      if (response.app_status === 'success') {
        this.firstName = '';
        this.lastName = '';
        this.selectedSupervisor = '';
        this.email = '';
        this.phoneNumber = '';
        this.successMessage = response.app_message;
      }
      else {
        this.errors = response.app_data;
      }
    });
  }
}
