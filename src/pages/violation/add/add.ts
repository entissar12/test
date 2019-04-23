import { Component } from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import {Camera, ImagePicker} from 'ionic-native';
import { BackendService } from '../../../providers/backendService';
import {Geolocation} from 'ionic-native';
import {TranslateService} from 'ng2-translate';
import {ViewerPage} from "../viewer/viewer";
import {Observable} from "rxjs";


@Component({
  templateUrl: 'add.html'
})
export class AddViolationPage {
  imageSrc : string;
  violation: {
    category?: number,
    description?: string,
    location?: string,
    address?: string,
    reporter?: string,
    date?: any,
  } = {};
  docs: any[] = [];
  submitted = false;
  categories: any[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public backendService:BackendService,
              public toastCtrl: ToastController,
              public translate: TranslateService,
              public loadingCtrl: LoadingController
  ) {

    this.violation.date = new Date().toISOString();

  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: ""
    });

    this.translate.get('Please wait...').subscribe(
      value => {
        loader.setContent(value);
      }
    );
    loader.present();
    this.loadLocation();
    this.fetchCategories();
    loader.dismiss();
  }

  loadLocation() {
    Geolocation.getCurrentPosition().then((position) => {
      this.violation.location = position.coords.latitude +',' +position.coords.longitude;
      this.backendService.geocode(this.violation.location)
        .subscribe(
          data => {
            if (data.results[0]) {
              this.violation.address = data.results[0].formatted_address;
            }
          },
          err => console.log(err),
          () => console.log('Geocoding finished')
        );
      return true;
    }, (err) => {
      console.log(err);
      return false;
    });
  }

  fetchCategories() {
    this.backendService.getCategories()
      .subscribe(
        data => {
          this.categories = data;
        },
        err => console.log(err),
        () => console.log('Categories fetched !')
      );
  }

  getUserlang() {
    return localStorage.getItem('lang');
  }

  openGallery (): void {
    let options = {};
    ImagePicker.getPictures(options).then(
      (results) => {
        for (var i = 0; i < results.length; i++) {
          this.docs.push({docfile: results[i], type: 'image'});
        }
      },
      (err) => {}
    );
  }

  openCamera(): void {
    let cameraOptions = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.FILE_URI,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true
    }

    Camera.getPicture(cameraOptions)
      .then(file_uri => this.docs.push({docfile: file_uri, type: 'image'}),
        err => console.log(err));
  }

  selectVideo(): void {
    let cameraOptions = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      mediaType: Camera.MediaType.VIDEO
    }

    Camera.getPicture(cameraOptions)
      .then(
        file_uri => this.docs.push({docfile: file_uri, type: 'video'}),
        err => console.log(err)
      );
  }

  addViolation(form) {
    let loading = this.loadingCtrl.create({
      content: ''
    });

    this.translate.get('Violation is being submitted ...').subscribe(
      value => {
        loading.setContent(value);
      }
    );


    loading.present();
    this.submitted = true;
    if(form.valid) {
      this.backendService.addViolation(
        this.violation.category,
        this.violation.description,
        this.violation.location,
        this.violation.address,
        this.violation.date
      )
        .subscribe(
          data => {

            console.log(data);

            console.log(this.docs);

            var promises = [];

            for (let doc of this.docs) {
              console.log('Uploading document : ' + doc.docfile);
              promises.push(this.backendService.uploadFile(data.id, doc.docfile));
            }

            Observable.forkJoin(promises).subscribe(() => {

            },(err) => {
              loading.dismiss();
              console.log('Error: %s', err.code);
              console.log('Error: %s', err.source);
              console.log('Error: %s', err.target);
              console.log('Error: %s', err.http_status);

              let toast = this.toastCtrl.create({
                message: '',
                duration: 3000,
                position: 'bottom'
              });
              this.translate.get('File Transfer Error').subscribe(
                value => {
                  toast.setMessage(value);
                }
              );
              toast.present();
              this.navCtrl.pop();
            },() => {
              loading.dismiss();
              let toast = this.toastCtrl.create({
                message: '',
                duration: 3000,
                position: 'bottom'
              });
              this.translate.get('Violation submitted successfully').subscribe(
                value => {
                  toast.setMessage(value);
                }
              );
              toast.present();
              this.navCtrl.pop();
            });
          },
          err => console.log(err),
          () => console.log('Violation added')
        );
    }
  }

  openViewer(document: any) {
    this.navCtrl.push(ViewerPage, document);
  }

  removeFile(index) {
    this.docs.splice(index, 1);
  }
}
