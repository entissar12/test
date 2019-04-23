import {Component, ViewChild, ElementRef} from '@angular/core';
import {Geolocation} from 'ionic-native';
import { Events, ToastController } from 'ionic-angular';
import { BackendService } from '../../providers/backendService';
import {NavController} from "ionic-angular";
import {TranslateService} from "ng2-translate";
// import {AddViolationPage} from "../violation/add/add";
// import {ViolationDetailsPage} from "../violation/details/details";


declare var google;

@Component({
  templateUrl: 'main.html'
})
export class MainPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  violation: {
    category?: string,
    description?: string,
    location?: string,
    address?: string,
    reporter?: string,
    date?: any,
  } = {};
  markers = [];

  constructor(public navCtrl: NavController,
              public backendService:BackendService,
              public events: Events,
              public toastCtrl: ToastController,
              public translate: TranslateService) {

    events.subscribe('menu:clicked', (category) => {
      this.filter(category);
    });
    events.subscribe('clear:filter', () => this.clearFilter());
  }


  ionViewDidEnter() {
    this.loadMap();
    google.maps.event.trigger(this.map, 'resize');
  }

  loadMap() {

    let latLng = new google.maps.LatLng("29.0969917", "17.2158509");

    let mapOptions = {
      center: latLng,
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      streetViewControl: false
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.backendService.getViolations()
      .subscribe(
        data => {

          for (let violation of data) {
            if (violation.location) {
              let marker = this.addMarker(violation);
              this.markers.push({violation: violation, marker: marker});
            }
          }
        },
        err => console.log(err),
        () => console.log('OK')
      );


    Geolocation.getCurrentPosition().then(
      (position) => this.map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
    );
  }


  addMarker(violation){
    let coords = violation.location.split(",");
    let location = new google.maps.LatLng(coords[0],coords[1]);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: location,
      icon: this.backendService.api_url +'media/' + violation.icon
    });

    google.maps.event.addListener(marker, 'click', () => {
      // this.navCtrl.push(ViolationDetailsPage, violation);
    });

    return marker;
  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  addViolation() {
    // this.navCtrl.push(AddViolationPage);
  }



  addPanic() {
    Geolocation.getCurrentPosition().then((position) => {
      this.violation.location = position.coords.latitude.toString() + ',' + position.coords.longitude.toString();
      this.backendService.geocode(this.violation.location)
        .subscribe(
          data => {
            if (data.results[0]) {
              this.violation.address = data.results[0].formatted_address;
            }
            this.violation.description = null;
            this.backendService.getPanic()
              .subscribe(
                data =>  {
                  console.log(data[0].url);
                  this.violation.category = data[0].url;
                  this.backendService.addViolation(
                    this.violation.category,
                    this.violation.description,
                    this.violation.location,
                    this.violation.address,
                    this.violation.date,
                  ).subscribe(
                    data => {
                      console.log(data);
                      let toast = this.toastCtrl.create({
                        message: 'Panic submitted successfully',
                        duration: 3000,
                        position: 'bottom'
                      });
                      toast.present();
                    },
                    err => console.log(err),
                    () => console.log('Panic added')
                  );
                },
                err => console.log(err),
                () => console.log('Panic loaded')
              )
          } ,
          err => console.log(err),
          () => console.log('Geocoding panic finished')
        );
    }, (err) => {
      console.log(err);
      let toast = this.toastCtrl.create({
        message: 'Adding panic needs location to be active',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
  }

  filter(category_id) {
    for (let marker of this.markers) {
      marker.marker.setVisible(marker.violation.category_id == category_id);
    }
  }

  clearFilter() {
    for (let marker of this.markers) {
      marker.marker.setVisible(true);
    }
  }

  refresh () {
    this.loadMap();
  }

  changeLang() {
    this.events.publish('change:lang');
  }
}
