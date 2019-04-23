import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, Events, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {BackendService} from "../providers/backendService";
import {TranslateService} from "ng2-translate";
import {HomePage} from '../pages/home/home'
@Component({
  templateUrl: 'app.html'
})
export class PaxApp {
  @ViewChild(Nav) nav: Nav;

  categories: Array<{id: string}>;
  pages: Array<{title: string, component: any}>;
  dir: string = "ltr";
  side: string = "left";
  constructor(public platform: Platform,
              public menu: MenuController,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public backendService: BackendService,
              public translate: TranslateService,
              public events: Events,
              public alertCtrl: AlertController) {

      this.getUserlang();

      this.initializeApp();
      splashScreen.hide();

      // events.subscribe('load:main', () => {
      //   this.initializeApp();
      // });

      events.subscribe('change:lang', () => {
        this.changeLang();
      });

    // this.pages = [
    //     {title: 'Hello Ionic', component: MainPage},
    //     {title: 'Add Violation', component: AddViolationPage},
    //     {title: 'Violation Details', component: ViolationDetailsPage},
    //     {title: 'Login', component: LoginPage},
    //     {title: 'Signup', component: SignupPage},
    //     {title: 'ResetPassword', component: ResetPasswordPage},
    //     {title: 'ChangePassword', component: ChangePasswordPage},
    //     {title: 'ConfirmResetPassword', component: ConfirmResetPasswordPage},
    //     {title: 'Stats', component: StatsPage},
    //     {title: 'Add Alert', component: AddAlertPage},
    //     {title: 'Alerts List', component: AlertListPage}
    //   ];


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      if (localStorage.getItem('token')) {

        this.backendService.getCategories()
          .subscribe(
            data => {
              this.categories = data;
              if (localStorage.getItem('token')) {
                // this.nav.setRoot(MainPage);
              }
            },
            err => console.log(err),
            () => console.log('Categories fetched !')
          );
      } else {
        this.nav.setRoot(HomePage);
      }
    });
  }

  userLogged () {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  getUserlang() {
    if (localStorage.getItem('lang') == 'ar') {
      localStorage.setItem('lang','ar');
      this.translate.use('ar');
      this.side = "right";
      this.platform.setDir("rtl", true);
    } else {
      localStorage.setItem('lang','en');
      this.translate.use('en');
      this.side = "left";
      this.platform.setDir("ltr", true);
    }
    return localStorage.getItem('lang');
  }

  changeLang() {
    if (localStorage.getItem('lang') == 'en') {
      localStorage.setItem('lang','ar');
      this.translate.use('ar');
      this.side = "right";
      this.platform.setDir("rtl", true);
    } else {
      localStorage.setItem('lang','en');
      this.translate.use('en');
      this.side = "left";
      this.platform.setDir("ltr", true);
    }
    this.menu.close();
    location.reload();
  }

}

