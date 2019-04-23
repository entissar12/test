import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import { BackendService } from '../../providers/backendService';
import {TranslateService} from "ng2-translate";
import {LoginPage} from "../login/login";
@Component({
    templateUrl: 'confirm-reset-password.html'
})
export class ConfirmResetPasswordPage {

    token ?: string;
    uid?: string;
    new_password1?: string;
    new_password2?: string;

    submitted = false;

    constructor(public navCtrl: NavController,
                public backendService: BackendService,
                public toastCtrl: ToastController,
                public translate: TranslateService) {

    }

    onChangePassword(form) {
        this.submitted = true;
        if (form.valid) {
            this.backendService.passwordResetConfirm(this.new_password1, this.new_password2, this.token)
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
                        this.navCtrl.setRoot(LoginPage);
                    }
                );
        }
    }

}
