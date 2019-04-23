import { Component } from '@angular/core';

import {NavController, ToastController} from 'ionic-angular';

import { BackendService } from '../../providers/backendService';

// import { MainPage } from '../main/main';
import {TranslateService} from "ng2-translate";
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: {
      first_name?: string,
      last_name?: string,
      username?: string,
      email?: string,
      password1?: string,
      password2?: string,
      media?: number,
      address?: string,
      phone?: string,
      office_phone?: string
  } = {};
  submitted = false;
  medias: any[] = [];

  constructor(public navCtrl: NavController,
              public backendService: BackendService,
              public toastCtrl: ToastController,
              public translate: TranslateService,
              public alertCtrl: AlertController
  ) {
    this.fetchMedias();
  }

  fetchMedias() {
    this.backendService.getMedias()
      .subscribe(
        data => {
          this.medias = data;
        },
        err => console.log(err),
        () => console.log('Medias fetched !')
      );
  }

  getUserlang() {
    return localStorage.getItem('lang');
  }

  onSignup(form) {
    this.submitted = true;

    if (form.valid) {
      var $obs = this.backendService.signup(this.signup);
      $obs.subscribe(
          data => {
              localStorage.setItem('token', data);
              // this.navCtrl.setRoot(MainPage);
          },
          err => {
              let toast = this.toastCtrl.create({
                  message : this.backendService.handleError(err),
                  duration: 3000,
                  position: 'bottom'
              });
              toast.present();
          },
          () => {});
    }
  }
}
