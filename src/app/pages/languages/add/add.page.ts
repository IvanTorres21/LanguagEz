import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { Language } from '../../../Models/language';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage {

  constructor(
    private db : DatabaseService, 
    private http : HttpRequestsService,
    private router : Router,
    private loadingC : LoadingController,
    private alertCtrl : AlertController,) {
   }
  
  public loading;
  public image : string;
  public englishName : string;
  public spanishName : string;
  private authToken;
  private body : JSON;
  
  ionViewDidEnter(){
    this.initializeData();
  }

   // Initializes elements
  async initializeData() {
    this.authToken = await this.db.get('auth');
    console.log(this.authToken);
    
  }

  /**
   * Checks if the input is correct and saves the language
   */
  async saveLanguage() {
    if(this.englishName.length > 3 && this.spanishName.length > 3 && this.image.length > 5) {
      // Show loading
      this.loading = await this.loadingC.create({
        message: 'Please wait...'
      });
      await this.loading.present();
      // prepare data and send request
      this.body = JSON.parse("{\"name\" : {\"en\" :\"" + this.englishName + "\",\"es\":\"" + this.spanishName + "\"}, \"image\":\"" + this.image + "\"}");
      await this.http.postRequest('store_language', JSON.parse(JSON.stringify(this.body)), this.authToken).subscribe(
        (data) => {        
          this.loading.dismiss();
          if(data['status_code'] == 200) {
            this.router.navigateByUrl('languages/index');
          } else {
            this.alertFailedSaving('Failed to save language');
          }

        }
      );     
      
    }
  }

  
  // Manages all redirects
  navigate(route : string, id : number) {
    this.router.navigateByUrl(`/${route}${id != undefined ? '/' + id: ''}`);
  }

   /**
   * Couldn't save alert
   */
    async alertFailedSaving(message : string) {
      let alert = await this.alertCtrl.create({
        header: message,
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
