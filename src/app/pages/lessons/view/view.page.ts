
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { Exercise } from '../../../Models/exercise';

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
  public lesson_id : Number;
  public currLanguage : string;
  public exercises : Exercise[] = [];

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
    this.lesson_id = Number.parseInt(this.id);
    this.authToken = await this.db.get('auth');
    await (await this.http.getRequest('get_lesson/' + this.id, this.authToken)).subscribe(
      (data) => {
        this.loading.dismiss();
        this.englishTitle = data['lesson']['title']['en'];
        this.theory.set('en',  data['lesson']['theory']['en'].replace('"', '\\"'));
        this.theory.set('es', data['lesson']['theory']['es'].replace('"', '\\"'));
        this.exercises = data['lesson']['exercises'];
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
  navigate(route : string, id : Number) {
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

     // Deletes an exercise
  async delete(exercise : Exercise) {
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.loading.present();
    await this.http.postRequest('delete_exercise', JSON.parse("{\"id\" : " + exercise.id +", \"lesson\" : " + true + "}"), this.authToken).subscribe((data) => {
      this.exercises = [];
      this.initializeData();
      this.loading.dismiss();
    });
  }
}