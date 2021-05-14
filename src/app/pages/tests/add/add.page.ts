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
  public englishTitle : string = "";
  public spanishTitle : string = "";
  private title : Map<string, string> = new Map;
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
    // Get id
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.authToken = await this.db.get('auth');
    if(this.id != undefined) { // Retrieve data if editing 
      this.loading.present();
      if(Number.parseInt(this.id) < 0) { // If we are editing an already existing lesson it'll be negative
        await (await this.http.getRequest('get_test/' + this.id.replace("-", ""), this.authToken)).subscribe(
          (data) => {
            this.loading.dismiss();
            this.englishTitle = data['test']['name']['en'];
            this.spanishTitle = data['test']['name']['es'];
          },
          async (error) => {
            if(error.status == 401) {
              await this.db.set('auth', null);
              this.loading.dismiss();
              this.navigate('login', undefined);
            }
          }
        );
      } else {
        this.loading.dismiss();
      }
    }
  }

  /**
   * Checks if the input is correct and saves the test
   */
  async saveTest() {
    if(this.englishTitle.length > 3 && this.spanishTitle.length > 3) {
      
      // Prepare loading
      this.loading = await this.loadingC.create({
        message: 'Please wait...'
      });
      // Show loading
      await this.loading.present();
      // prepare data and send request      
      if(Number.parseInt(this.id) > 0) { // New lesson
        this.title.set('en', this.englishTitle);
        this.title.set('es', this.spanishTitle);
        this.body = "{\"name\" : " + "{\"en\" : \"" + this.title.get('en') + "\", \"es\" : \""+ this.title.get('es') + "\"} , \"id\" : " + this.id +"}";     
        console.log(this.body);
        
         await this.http.postRequest('store_test', JSON.parse(this.body), this.authToken).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.navigate('lessons/index', Number.parseInt(this.id));
            } else {
              this.alertFailedSaving('Failed to save test');
            }
          },
          async (error) => {
            if(error.status == 401) {
              await this.db.set('auth', null);
              this.navigate('login', undefined);
            } else {
              this.alertFailedSaving('Couldn\'t save test');
            }
            this.loading.dismiss();
          }
        );     
      } else { // Update lesson
        this.title.set('en', this.englishTitle);
        this.title.set('es', this.spanishTitle); 
        this.body = "{\"name\" : " + "{\"en\" : \"" + this.title.get('en') + "\", \"es\" : \""+ this.title.get('es') + "\"} , \"id\" : " + this.id.replace("-", "") +"}";
        await (await this.http.postRequest('update_test', JSON.parse(this.body), this.authToken)).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.navigate('lessons/index', data['test']['languages_id']);
            } else {
              this.alertFailedSaving('Failed to update test');
            }
  
          },
          async (error) => {
            if(error.status == 401) {
              await this.db.set('auth', null);
              this.navigate('login', undefined);
            } else {
              this.alertFailedSaving('Failed to update test');
            }
            this.loading.dismiss();
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