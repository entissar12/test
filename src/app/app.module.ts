import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {BackendService} from "../providers/backendService";
import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from "ng2-translate";
import { PaxApp } from './app.component';
import {LoginPage} from "../pages/login/login";
import {ConfirmResetPasswordPage} from "../pages/confirm-reset-password/confirm-reset-password";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {ResetPasswordPage} from "../pages/reset-password/reset-password";
import {SignupPage} from "../pages/signup/signup";
import { MainPage } from '../pages/main/main';
import {PrivacyPolicy} from "../pages/privacy-policy/privacy_policy";
import {AddAlertPage} from "../pages/alerts/alert/alert";
import {AlertListPage} from "../pages/alerts/list/list";
import {AddViolationPage} from "../pages/violation/add/add";
import {ViolationDetailsPage} from "../pages/violation/details/details";
import {ViewerPage} from "../pages/violation/viewer/viewer";
import {StatsPage} from "../pages/stats/stats";

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    PaxApp,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ChangePasswordPage,
    ConfirmResetPasswordPage,
    MainPage,
    PrivacyPolicy,
    AddAlertPage,
    AlertListPage,
    AddViolationPage,
    ViolationDetailsPage,
    ViewerPage,
    StatsPage,
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
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ChangePasswordPage,
    ConfirmResetPasswordPage,
    MainPage,
    PrivacyPolicy,
    AddAlertPage,
    AlertListPage,
    AddViolationPage,
    ViolationDetailsPage,
    ViewerPage,
    StatsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BackendService,
  ]
})
export class AppModule {}
