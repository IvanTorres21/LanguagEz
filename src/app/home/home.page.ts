import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { HttpRequestsService } from '../services/http-requests.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  constructor(private db : DatabaseService, private http : HttpRequestsService) {
    db.init();
  }

  public email : string;
  public password : string;

  async goLogin() {
    if(this.email.length > 3 && this.email.search("@") && this.password.length > 6) {
      var data = {
        email : this.email,
        password : this.password
      };
      console.log(JSON.parse(JSON.stringify(data)));
      console.log('Start');
    
      
      await this.http.postRequest('login', JSON.parse(JSON.stringify(data))).subscribe(
        (data) => {
          this.db.set('auth', data['access_token'])
          //Redirect to launchscreen
        }
      );
      
      
    }
  }

  autoLogin() {
    
  }

}
