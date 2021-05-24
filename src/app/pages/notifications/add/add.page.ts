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
      await (await this.http.getRequest('get_notification/' + this.id.replace("-", ""), this.authToken)).subscribe(
        (data) => {
          this.loading.dismiss();
          this.englishTitle = data['notification']['title']['en'];
          this.spanishTitle = data['notification']['title']['es'];
          this.theory.set('en',  data['notification']['content']['en'].replace('"', '\\"'));
          this.theory.set('es', data['notification']['content']['es'].replace('"', '\\"'));
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


  /**
   * Change between notification
   */
  changeLanguage(language : string) {
    this.currLanguage = language;
  }

  /**
   * Checks if the input is correct and saves the notification
   */
  async saveLesson() {
    if(this.englishTitle.length > 3 && this.spanishTitle.length > 3) {
      
      // Prepare loading
      this.loading = await this.loadingC.create({
        message: 'Please wait...'
      });
      // Show loading
      await this.loading.present();
      // prepare data and send request      
      if(this.id == undefined) { // New notification
        this.title.set('en', this.englishTitle);
        this.title.set('es', this.spanishTitle);
        this.body = "{\"title\" : " + "{\"en\" : \"" + this.title.get('en') + "\", \"es\" : \""+ this.title.get('es') + "\"} , \"content\" :" + "{\"en\" : \"" + this.theory.get('en').replace('\n', '\\n') + "\", \"es\" : \""+ this.theory.get('es').replace('\n', '\\n') + "\"}}";
        console.log(this.body);     
      
         await this.http.postRequest('store_notification', JSON.parse(this.body), this.authToken).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.navigate('notification/index',undefined);
            } else {
              this.alertFailedSaving('Failed to save notification');
            }
          },
          async (error) => {
            if(error.status == 401) {
              await this.db.set('auth', null);
              this.navigate('login', undefined);
            } else {
              this.alertFailedSaving('Couldn\'t save notification');
            }
            this.loading.dismiss();
          }
        );     
      } else { // Update notification
        this.title.set('en', this.englishTitle);
        this.title.set('es', this.spanishTitle); 
        this.body = "{\"title\" : " + "{\"en\" : \"" + this.title.get('en') + "\", \"es\" : \""+ this.title.get('es') + "\"} , \"content\" :" + "{\"en\" : \"" + this.theory.get('en').replace('\n', '\\n') + "\", \"es\" : \""+ this.theory.get('es').replace('\n', '\\n') + "\"}, \"id\" : " + this.id +"}";
        await (await this.http.postRequest('update_notification', JSON.parse(this.body), this.authToken)).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.navigate('notification/index', undefined);
            } else {
              this.alertFailedSaving('Failed to update notification');
            }
  
          },
          async (error) => {
            if(error.status == 401) {
              await this.db.set('auth', null);
              this.navigate('login', undefined);
            } else {
              this.alertFailedSaving('Failed to update notification');
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