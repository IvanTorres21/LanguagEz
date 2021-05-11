import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    private alertCtrl : AlertController,
    private activatedRoute : ActivatedRoute) {
   }
  
  public loading;
  public image : string;
  public englishName : string;
  public spanishName : string;
  private authToken;
  private id : string;
  private body : string;
  
  ionViewDidEnter(){
    this.initializeData();
  }

   // Initializes elements
  async initializeData() {
    // Prepare loading
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
     this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.authToken = await this.db.get('auth');
    if(this.id != undefined) {
      this.loading.present();
      await (await this.http.getRequest('get_language/' + this.id, this.authToken)).subscribe(
        (data) => {
          this.loading.dismiss();
          this.englishName = data['language']['name']['en'];
          this.spanishName = data['language']['name']['es'];
          this.image = data['language']['image'];
        }
      );
    }
    console.log(this.authToken);
    
  }

  /**
   * Checks if the input is correct and saves the language
   */
  async saveLanguage() {
    if(this.englishName.length > 3 && this.spanishName.length > 3 && this.image.length > 5) {
      // Show loading
      await this.loading.present();
      // prepare data and send request      
      if(this.id == undefined) { // New language
        this.body = "{\"name\" : \"{\\\"en\\\" :\\\"" + this.englishName + "\\\",\\\"es\\\":\\\"" + this.spanishName + "\\\"}\", \"image\":\"" + this.image + "\"}";
        await this.http.postRequest('store_language', JSON.parse(this.body), this.authToken).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.router.navigateByUrl('languages/index');
            } else {
              this.alertFailedSaving('Failed to save language');
            }
  
          }
        );     
      } else { // Update language
        this.body = "{\"id\" : "+ this.id +", \"name\" : \"{\\\"en\\\" :\\\"" + this.englishName + "\\\",\\\"es\\\":\\\"" + this.spanishName + "\\\"}\", \"image\":\"" + this.image + "\"}";
        await (await this.http.postRequest('update_language', JSON.parse(this.body), this.authToken)).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.router.navigateByUrl('languages/index');
            } else {
              this.alertFailedSaving('Failed to update language');
            }
  
          }
        );     
      }
      
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
