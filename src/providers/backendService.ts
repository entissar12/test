import {Injectable, Inject} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/Rx';
import {Transfer, FileUploadResult} from "ionic-native";

@Injectable()
export class BackendService {

  private server: string = 'https://pax.o3stech.com/';
  // private local: string = 'http://192.168.1.63:8000/';
  public api_url: string = this.server;

  constructor(@Inject(Http) public http:Http) {

  }

  public login(username: string, password: string): Observable<any> {
    var creds = {
      username: username,
      password: password
    };
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    var $obs = this.http.post(this.api_url +localStorage.getItem('lang')+'/rest-auth/login/', creds, {
      headers: header
    }).map(res => this.getToken(res));

    return $obs;
  }

  public logout(token: string) {
    var creds = {
      token: token
    };
    this.http.post(this.api_url +localStorage.getItem('lang')+'/rest-auth/logout/', creds, {})
      .map(res => res.json().success);
  }

  public signup(signup: {}): Observable<any> {
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    var $obs = this.http.post(this.api_url +localStorage.getItem('lang')+'/rest-auth/registration/', signup, {})
      .map(res => this.getToken(res));

    return $obs;
  }

  public resetpassword(email) : Observable<any>{
    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');

    var $obs = this.http.post(this.api_url +localStorage.getItem('lang')+'/rest-auth/password/reset/', 'email='+email, {
      headers: header
    }).map(res => {
      console.log(res.json());
    });

    return $obs;
  }

  public passwordResetConfirm(password1, password2, token) {
    var data = {
      new_password1 : password1,
      new_password2 : password2,
      token : token
    }
    var $obs = this.http.post(this.api_url+localStorage.getItem('lang')+'/rest-auth/password/reset/confirm/',
      data, {})
      .map(res => res.json());
    return $obs;
  }

  public changepassword(changepassword: {}) : Observable<any> {
    var header = this.getHeader();

    var $obs = this.http.post(this.api_url+localStorage.getItem('lang')+'/rest-auth/password/change/', changepassword, {
      headers: header
    }).map(res => res.json());
    return $obs;
  }

  public getToken(res) {
    return res.json().key;
  }

  public addViolation(category, description, location, address, date): Observable<any> {
    var header = this.getHeader();
    let data = {
      category: category,
      description: description,
      location: location,
      address:address,
      date: date
    };
    return this.http.post(this.api_url+'violations/', data, {headers: header})
      .map(res => res.json());
  }

  public handleError(error) {
    return JSON.parse(error._body).username ||
      JSON.parse(error._body).password1 ||
      JSON.parse(error._body).non_field_errors ||
      JSON.parse(error._body).new_password2 ||
      JSON.parse(error._body).old_password |
      JSON.parse(error._body).email ||
      JSON.parse(error._body).token;
  }

  public getViolations() {
    var header = this.getHeader();

    return this.http.get(this.api_url + 'violations/?status=Valid', {headers: header})
      .map(res => res.json());
  }

  public getCategories() {
    var header = this.getHeader();

    return this.http.get(this.api_url + 'categories/', { headers: header })
      .map(res => res.json());
  }

  public getPanic() {
    var header = this.getHeader();

    return this.http.get(this.api_url + 'categories/?english_name=Panic', { headers: header })
      .map(res => res.json());
  }


  public getMedias() {
    return this.http.get(this.api_url + 'medias/', {})
      .map(res => res.json());
  }

  public geocode(latlng): Observable<any> {
    var maps_url = 'https://maps.googleapis.com/maps/api/geocode/json?';
    var apikey = 'AIzaSyAxiuPIbaFAmsJ9tLch5gDXL919DeTBtOU';
    return this.http.get(maps_url + 'latlng=' + latlng + '&key=' + apikey)
      .map(res =>res.json());
  }

  public getHeader(){
    var token = localStorage.getItem('token');
    let header = new Headers();
    header.append('Authorization', 'Token ' + token);
    return header;
  }

  public uploadFile(violation_id, fileUrl): Promise<FileUploadResult> {
    let header = this.getHeader();
    const fileTransfer = new Transfer();
    return fileTransfer.upload(fileUrl, encodeURI(this.api_url + 'attachments/'), {
      'fileKey': 'docfile',
      'fileName': fileUrl.split('/').pop(),
      'params' :{
        'violation': this.api_url + 'violations/' + violation_id + '/'
      },
      'chunkedMode': false,
      'headers': header
    });
  }

  public countViolations(category_id) {
    var header = this.getHeader();
    return this.http.get(this.api_url + 'violations/?category='+category_id, { headers: header })
      .map(res => res.json());
  }

  public countViolationsPerMonth(month){
    var header = this.getHeader();
    return this.http.get(this.api_url + 'violations/?category=&date='+month, {headers: header})
      .map(res => res.json());
  }
  public sendDeviceToken(registration_ID, platform_type) {
    var header = this.getHeader();
    let data = {
      registration_id: registration_ID,
      device_id:localStorage.getItem('token'),
      type: platform_type,
      active: true
    };
    console.log(data);
    return this.http.post(this.api_url + 'devices/', data, {headers: header});
  }

  public addAlert(category, address) {
    var header = this.getHeader();

    let data = {
      category: category,
      address:address
    };
    return this.http.post(this.api_url+'alerts/', data, {headers: header})
      .map(res => res.json());

  }

  public getAlerts() {
    var header = this.getHeader();
    return this.http.get(this.api_url + 'alerts/', {headers: header})
      .map(res => res.json());
  }
}
