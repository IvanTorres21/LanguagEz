import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { HttpRequestsService } from '../../services/http-requests.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage  {


  constructor(
    private db : DatabaseService,
    private http : HttpRequestsService,
    private router : Router,
    private alertCtrl : AlertController,
    private loadingC : LoadingController) 
    {
      db.init();
    }
  
  
  public loading;
  private token : string;
  public email : string =  '';
  public password : string = '';

    ionViewDidEnter(){
     this.autoLogin();
    }

  /**
   * Try to login
   */
  async goLogin() {
    if(this.email.length > 3 && this.email.search("@") && this.password.length > 6) {
      this.loading = await this.loadingC.create({
        message: 'Please wait...'
      });
      await this.loading.present();
      var data = {
        email : this.email,
        password : this.password
      };
      await this.http.postRequest('login', JSON.parse(JSON.stringify(data)), undefined).subscribe(
        (data) => {        
          this.loading.dismiss();
          if(data['status_code'] == 200) {
            this.db.set('auth', data['access_token']);
            this.router.navigateByUrl('languages/index');
          } else {
            this.alertFailedLogin('Failed to login');
          }

        }
      );     
    } else {
      this.alertFailedLogin('Credentials not valid');
    }
    
  }

  /**
   * If the user already logged in, skip this page.
   */
  async autoLogin() {
    this.token = await this.db.get('auth');
    console.log(this.token);
    if(this.token != null) {
      console.log('token');
      
      this.router.navigateByUrl('languages/index');
    }
  }

  /**
   * Couldn't login alert
   */
  async alertFailedLogin(message : string) {
    let alert = await this.alertCtrl.create({
      header: 'Failed to login',
      message: `
                <p>${message}</p>`,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

}
