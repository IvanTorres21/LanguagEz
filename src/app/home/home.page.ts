import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { HttpRequestsService } from '../services/http-requests.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  constructor(private db : DatabaseService) {
    db.init();
  }

  public email : string;
  public password : string;

  goLogin() {
    if(this.email.length > 3 && this.email.search("@") && this.password.length > 6) {
      var data = {
        email : this.email,
        password : this.password
      };
      console.log(JSON.parse(JSON.stringify(data)));
      //TODO: Fix http injection, save auth token
      //this.http.postRequest('login', JSON.parse(data.toString()));
    }
  }

  autoLogin() {
    
  }

}
