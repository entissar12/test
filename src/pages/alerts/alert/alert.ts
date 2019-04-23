import { Component } from '@angular/core';
import { BackendService } from '../../../providers/backendService';
import {TranslateService} from 'ng2-translate';
import {NavController, ToastController} from "ionic-angular";


@Component({
  templateUrl: 'alert.html'
})
export class AddAlertPage {
  alert: {
    category?: number,
    address?: string} = {};
  categories: any[] = [];

  constructor(public navCtrl: NavController,
              public backendService:BackendService,
              public translate: TranslateService,
              public toastCtrl: ToastController
  ) {
    this.fetchCategories();
  }

  fetchCategories() {
    this.backendService.getCategories()
      .subscribe(
        data => {
          this.categories = data;
        },
        err => console.log(err),
        () => console.log('Categories fetched !')
      );
  }

  getUserlang() {
    return localStorage.getItem('lang');
  }

  addAlert(form) {
    if(form.valid) {
      this.backendService.addAlert(
        this.alert.category,
        this.alert.address
      ).subscribe(
          data => {
            console.log(data);
            let toast = this.toastCtrl.create({
              message: '',
              duration: 3000,
              position: 'bottom'
            });
            this.translate.get('Alert submitted successfully').subscribe(
              value => {
                toast.setMessage(value);
              }
            );
            toast.present();
            this.navCtrl.pop();
          },
          err => console.log(err),
          () => console.log('Alert added')
        );
    }
  }
}
