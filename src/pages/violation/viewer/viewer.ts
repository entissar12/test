import { Component } from '@angular/core';

import {NavParams, NavController} from 'ionic-angular';
import {TranslateService} from "ng2-translate";



@Component({
  templateUrl: 'viewer.html'
})
export class ViewerPage {

  document: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService
  ) {

    this.document = navParams.data;

  }

}
