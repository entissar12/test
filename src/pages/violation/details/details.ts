import { Component } from '@angular/core';

import {NavParams, NavController} from 'ionic-angular';
import {TranslateService} from "ng2-translate";
import {ViewerPage} from "../viewer/viewer";



@Component({
  templateUrl: 'details.html'
})
export class ViolationDetailsPage {
  violation: {reporter_name?: string, category_english_name?: string, category_arabic_name?: string, description?: string, location?: string, address?: string, created_date?: Date, documents: [{docfile?: string, type?: string}]};
  rows: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {

    let documents_list = navParams.get('documents');
    this.rows = Array.from(Array(Math.ceil(documents_list.length / 3)).keys());
    for (var document of documents_list){
      let extension = document.docfile.split(".").pop();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'tiff':
        case 'gif':
        case 'bmp':
          document.type = 'image';
          break;
        case 'mp4':
          document.type = 'video';
          break;
        case 'mp3':
          document.type = 'audio';
          break;
      }

    }
    this.violation = navParams.data;
  }

  openViewer(document: any) {
    this.navCtrl.push(ViewerPage, document);
  }

  getUserlang() {
    return localStorage.getItem('lang');
  }
}
