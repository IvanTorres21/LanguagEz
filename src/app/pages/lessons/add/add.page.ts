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
export class AddPage implements OnInit {
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
  public theory : Map<string, string> = new Map;
  private authToken;
  private id : string;
  private body : string;
  public currLanguage : string;

  ngOnInit() {
    this.theory.set('en', '');
    this.theory.set('es', '');
  }

  ionViewDidEnter(){
    this.initializeData();
  }

   // Initializes elements
  async initializeData() {
    // Prepare loading
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.currLanguage = 'en';
    // Get id
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.authToken = await this.db.get('auth');
    if(this.id != undefined) { // Retrieve data if editing 
      this.loading.present();
      if(Number.parseInt(this.id) < 0) { // If we are editing an already existing lesson it'll be negative
        await (await this.http.getRequest('get_lesson/' + this.id.replace("-", ""), this.authToken)).subscribe(
          (data) => {
            this.loading.dismiss();
            this.englishTitle = data['lesson']['title']['en'];
            this.spanishTitle = data['lesson']['title']['es'];
            this.theory.set('en',  data['lesson']['theory']['en']);
            this.theory.set('es', data['lesson']['theory']['es']);
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
   * Change between languages
   */
  changeLanguage(language : string) {
    this.currLanguage = language;
  }

  /**
   * Checks if the input is correct and saves the language
   */
  async saveLesson() {
    console.log('Gonna save?');
    console.log(this.theory.get('en'));
    
    if(this.englishTitle.length > 3 && this.spanishTitle.length > 3) {
      console.log('Yay! saving!');
      
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
        this.body = "{\"title\" : " + "{\"en\" : \"" + this.title.get('en') + "\", \"es\" : \""+ this.title.get('es') + "\"} , \"theory\" :" + "{\"en\" : \"" + this.theory.get('en') + "\", \"es\" : \""+ this.theory.get('es') + "\"}, \"id\" : " + this.id +"}";
        console.log(this.body);     
      
         await this.http.postRequest('store_lesson', JSON.parse(this.body), this.authToken).subscribe(
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
              this.navigate('login', undefined);
            } else {
              this.alertFailedSaving('Couldn\'t save lesson');
            }
            this.loading.dismiss();
          }
        );     
      } else { // Update lesson
        this.title.set('en', this.englishTitle);
        this.title.set('es', this.spanishTitle); 
        this.body = "{\"title\" : " + this.title + ", \"theory\" : " + this.theory +", \"id\" : " + this.id +"}";
        await (await this.http.postRequest('update_lesson', JSON.parse(this.body), this.authToken)).subscribe(
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
              this.navigate('login', undefined);
            } else {
              this.alertFailedSaving('Failed to update language');
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