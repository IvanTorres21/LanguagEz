import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  base_url : string = "https://languagezapi.herokuapp.com/api";
  auth_token : string = "";

  constructor(private http : HTTP) {
    this.prepareClient();
  }

  /**
   * Sets up the http client
   */
  private prepareClient() {
    this.http.setDataSerializer("json");
    //Get auth from local storage
    if(this.auth_token != "") {
      this.http.setHeader("languagezapi.herokuapp.com", "Authentication", this.auth_token);
    }
  }

  /**
   * Function that makes a post request to the api
   * @param url Url of the request
   * @param body data of the request
   */
  public postRequest(url : string, body : JSON) {
    this.http.post(this.base_url + url, body, {}).then(data => {
      return data.data;
    }).catch(error => {
      console.error('ERROR ON REQUEST: ' + error.error);
    });
  }

  /**
   * Function that makes a get request to the api
   * @param url Url of the request
   */
   public getRequest(url : string) {
    this.http.get(this.base_url + url, {}, {}).then(data => {
      return data.data;
    }).catch(error => {
      console.error('ERROR ON REQUEST: ' + error.error);
    });
  }

  /**
   * Function that makes a put request to the api
   * @param url Url of the request
   * @param body data of the request
   */
   public putRequest(url : string, body : JSON) {
    this.http.put(this.base_url + url, body, {}).then(data => {
      return data.data;
    }).catch(error => {
      console.error('ERROR ON REQUEST: ' + error.error);
    });
  }
}
