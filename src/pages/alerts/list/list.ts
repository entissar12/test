import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {TranslateService} from "ng2-translate";
import {BackendService} from "../../../providers/backendService";



@Component({
  templateUrl: 'list.html'
})
export class AlertListPage {
  alerts: any[] = [];
  constructor(public navCtrl: NavController,
              public translate: TranslateService,
              public backendService: BackendService) {
    this.getAlerts();
  }

  getAlerts() {
    return this.backendService.getAlerts()
      .subscribe(
        data => {
          this.alerts = data;
        },
        err => console.log(err),
        () => console.log('Alerts fetched !')
      );
  }

  getUserlang() {
    return localStorage.getItem('lang');
  }
}
