import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import { BackendService } from '../../providers/backendService';
import {TranslateService} from "ng2-translate";
import {ConfirmResetPasswordPage} from "../confirm-reset-password/confirm-reset-password";

@Component({
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {

    mail?: string;
    submitted = false;

    constructor(public navCtrl: NavController,
                public backendService: BackendService,
                public toastCtrl: ToastController,
                public translate: TranslateService
    ) {

    }



  onResetPassword(form){
      this.submitted = true;

      if (form.valid) {
           this.backendService.resetpassword(this.mail)
               .subscribe (
                   data => console.log(data),
                   err => {
                       let toast = this.toastCtrl.create({
                           message : this.backendService.handleError(err),
                           duration: 3000,
                           position: 'bottom'
                       });

                       toast.present();
                   },
                   () => {
                       let toast = this.toastCtrl.create({
                           message : '',
                           duration: 3000,
                           position: 'bottom'
                       });
                       this.translate.get('An email of password reset will be sent in few minutes').subscribe(
                           value => {
                               toast.setMessage(value);
                           }
                       );

                       toast.present();
                       this.navCtrl.push(ConfirmResetPasswordPage);
                   }
               );
      }
  }
}
