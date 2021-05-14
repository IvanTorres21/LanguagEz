
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

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
  public theory : Map<string, string> = new Map;
  private authToken;
  private id : string;
  public currLanguage : string;

  ngOnInit() {
    this.theory.set('en', '');
    this.theory.set('es', '');
  }

  ionViewDidEnter(){
    console.log('hello');
    
    this.initializeData();
  }

   // Initializes elements
  async initializeData() {
    // Prepare loading
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.loading.present();
    this.currLanguage = 'en';
    // Get id
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.authToken = await this.db.get('auth');
    await (await this.http.getRequest('get_test/' + this.id, this.authToken)).subscribe(
      (data) => {
        this.loading.dismiss();
        this.englishTitle = data['test']['name']['en'];
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


  /**
   * Change between languages
   */
  changeLanguage(language : string) {
    this.currLanguage = language;
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