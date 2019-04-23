import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import { BackendService } from '../../providers/backendService';
import {MainPage} from "../main/main";
import {TranslateService} from "ng2-translate";

@Component({
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {

    changepassword : {
        old_password?: string,
        new_password1?: string,
        new_password2?: string,
    } = {};
    submitted = false;

  constructor(public navCtrl: NavController,
              public backendService: BackendService,
              public toastCtrl: ToastController,
              public translate: TranslateService) {

  }

  onChangePassword(form) {
      this.submitted = true;
      if (form.valid) {
        this.backendService.changepassword(this.changepassword)
            .subscribe(
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
                    this.translate.get('Password Changed successfully').subscribe(
                        value => {
                            toast.setMessage(value);
                        }
                    );
                    toast.present();
                    this.navCtrl.setRoot(MainPage);
                }
            );
      }
  }

}
