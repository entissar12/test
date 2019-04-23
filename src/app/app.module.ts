import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {BackendService} from "../providers/backendService";
import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from "ng2-translate";
import { PaxApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {ConfirmResetPasswordPage} from "../pages/confirm-reset-password/confirm-reset-password";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {ResetPasswordPage} from "../pages/reset-password/reset-password";
import {SignupPage} from "../pages/signup/signup";

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    PaxApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ChangePasswordPage,
    ConfirmResetPasswordPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(PaxApp),
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PaxApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ChangePasswordPage,
    ConfirmResetPasswordPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BackendService,
  ]
})
export class AppModule {}
