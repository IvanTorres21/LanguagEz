import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage  {
  constructor(
    private db : DatabaseService, 
    private http : HttpRequestsService,
    private router : Router,
    private loadingC : LoadingController,
    private alertCtrl : AlertController,
    private activatedRoute : ActivatedRoute) {
   }
  
  public loading;
  public englishTitle : string;
  public spanishTitle : string;
  public englishTheory : string;
  public spanishTheory : string;
  private authToken;
  private id : string;
  private body : string;
  
  ionViewDidEnter(){
    //this.initializeData();
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
      if(Number.parseInt(this.id) < 0) { // If we are editing an already existing lesson it'll be negative
        await (await this.http.getRequest('get_lesson/' + this.id.replace("-", ""), this.authToken)).subscribe(
          (data) => {
            this.loading.dismiss();
            this.englishTitle = data['lesson']['title']['en'];
            this.spanishTitle = data['lesson']['title']['es'];
            this.englishTheory = data['lesson']['theory']['en'];
            this.spanishTheory = data['lesson']['theory']['es'];
          },
          async (error) => {
            if(error.status == 401) {
              await this.db.set('auth', null);
              this.loading.dismiss();
              this.navigate('login', undefined);
            }
          }
        );
      }
    }
    console.log(this.authToken);
  }

  /**
   * Checks if the input is correct and saves the language
   */
  async saveLanguage() {
    if(this.englishTitle.length > 3 && this.spanishTitle.length > 3 && this.spanishTheory.length > 5 && this.englishTheory.length > 5) {
      // Show loading
      await this.loading.present();
      // prepare data and send request      
      if(Number.parseInt(this.id) > 0) { // New lesson
        this.body = "{\"title\" : \"{\\\"en\\\" :\\\"" + this.englishTitle + "\\\",\\\"es\\\":\\\"" + 
                    this.spanishTitle + "\\\"}\", \"theory\" : \"{\\\"en\\\" :\\\"" + this.englishTheory + 
                    "\\\",\\\"es\\\":\\\"" + this.spanishTheory + "\\\"}\", \"id\" : \"" + this.id +"\"}";
        await this.http.postRequest('store_language', JSON.parse(this.body), this.authToken).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.navigate('lessons/index/', Number.parseInt(this.id));
            } else {
              this.alertFailedSaving('Failed to save language');
            }
          },
          async (error) => {
            if(error.status == 401) {
              await this.db.set('auth', null);
              this.loading.dismiss();
              this.navigate('login', undefined);
            }
          }
        );     
      } else { // Update lesson
        this.body = "{\"id\" : "+ this.id.replace("-", "") +", \"title\" : \"{\\\"en\\\" :\\\"" + this.englishTitle + "\\\",\\\"es\\\":\\\"" + 
        this.spanishTitle + "\\\"}\", \"theory\" : \"{\\\"en\\\" :\\\"" + this.englishTheory + 
        "\\\",\\\"es\\\":\\\"" + this.spanishTheory + "\\\"}\"}";
        await (await this.http.postRequest('update_language', JSON.parse(this.body), this.authToken)).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.navigate('lessons/index/', data['lesson']['languages_id']);
            } else {
              this.alertFailedSaving('Failed to update language');
            }
  
          },
          async (error) => {
            if(error.status == 401) {
              await this.db.set('auth', null);
              this.loading.dismiss();
              this.navigate('login', undefined);
            }
          });   
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