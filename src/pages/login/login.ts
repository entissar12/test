import { Component } from '@angular/core';
import {NavController, ToastController, Events} from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import {ResetPasswordPage} from "../reset-password/reset-password";
import {TranslateService} from "ng2-translate";
import {BackendService} from "../../providers/backendService";
// import {MainPage} from "../main/main";

@Component({
  templateUrl: 'login.html'
})
export class LoginPage {
  login: {username?: string, password?: string} = {};
  submitted = false;
  auth_status:string = null;
  is_auth_error:boolean = false;

  constructor(public navCtrl: NavController,
              public backendService: BackendService,
              public toastCtrl: ToastController,
              public events: Events,
              public translate: TranslateService
  ) {

  }

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      var $obs = this.backendService.login(this.login.username, this.login.password);
      $obs.subscribe(
        data => {
          localStorage.setItem('token', data);
          this.is_auth_error = false;
          // this.navCtrl.setRoot(MainPage);
          this.events.publish('load:main');
        },
        err => {
          let toast = this.toastCtrl.create({
            message : this.backendService.handleError(err),
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
          this.is_auth_error = true;
        },
        () => {});
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  onForgotPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }

  changeLang() {
    this.events.publish('change:lang');
  }
}
