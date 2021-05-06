import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from '../services/database.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  base_url : string = "https://languagezapi.herokuapp.com/api/";
  auth_token : string = "";

  constructor(private http : HttpClient, private db : DatabaseService) {
    this.prepareClient();
  }

  /**
   * Sets up the http client
   */
  private async prepareClient() {
    // Start Ionic storage and search for the auth token
    await this.db.init();
    await this.db.get('auth').then((value) => this.auth_token = value).catch((error) => console.error(error));
    //Get auth from local storage
  }

  /**
   * Function that makes a post request to the api
   * @param url Url of the request
   * @param body data of the request
   */
  public postRequest(url : string, body : JSON) {
    console.log(this.base_url + url);
    return this.http.post(this.base_url + url, body, {headers: {'Authorization' : this.auth_token ? this.auth_token : ''}});
  }

  /**
   * Function that makes a get request to the api
   * @param url Url of the request
   */
   public async getRequest(url : string) {
    console.log(this.base_url + url);
    return this.http.get(this.base_url + url, {headers: {'Authorization' : this.auth_token ? this.auth_token : ''}});
  }

  /**
   * Function that makes a put request to the api
   * @param url Url of the request
   * @param body data of the request
   */
   public async putRequest(url : string, body : JSON) {
    console.log(this.base_url + url);
    return this.http.put(this.base_url + url, body, {headers: {'Authorization' : this.auth_token ? this.auth_token : ''}});
  }
}
