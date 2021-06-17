import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { LoadingController, AlertController } from '@ionic/angular';

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
  public ogWord : string;
  public prWord : string;
  public trWord : Map<string, string> = new Map;
  private authToken;
  private id : string;
  private body : string;
  
  ngOnInit() {
    this.trWord.set('en', '');
    this.trWord.set('es', '');
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
     this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.authToken = await this.db.get('auth');
    if(this.id != undefined) {
      
      if(Number.parseInt(this.id) < 0) {
        this.loading.present();
        await (await this.http.getRequest('getWord/' + this.id.replace('-', ''), this.authToken)).subscribe(
          (data) => {
            this.loading.dismiss();
            this.ogWord = data['word']['og_word'];
            this.prWord = data['word']['pr_word'];
            this.trWord.set('en', data['word']['tr_word']['en']);
            this.trWord.set('es', data['word']['tr_word']['es']);
            console.log(this.trWord);
            
          }
        );
      }
      
    }
    console.log(this.authToken);
    
  }

  /**
   * Checks if the input is correct and saves the word
   */
  async saveWord() {
    if(this.ogWord.length > 0 && this.prWord.length > 0) {
      // Show loading
      this.loading = await this.loadingC.create({
        message: 'Please wait...'
      });
      await this.loading.present();
      // prepare data and send request      
      if(Number.parseInt(this.id) > 0) { // New word
        this.body = "{\"id\" : " + this.id + ", \"ogWord\" : \"" + this.ogWord +"\", \"prWord\":\"" + this.prWord + "\", \"trWord\" : \"{\\\"en\\\" : \\\"" + this.trWord.get('en') + "\\\", \\\"es\\\" : \\\"" + this.trWord.get('es') + "\\\"}\"}";
        console.log(this.body);
        
        await this.http.postRequest('store_word', JSON.parse(this.body), this.authToken).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.navigate('dictionary/view', Number.parseInt(this.id));
            } else {
              this.alertFailedSaving('Failed to save language');
            }
  
          }
        );     
      } else { // Update word
        this.body = "{\"id\" : " + this.id.replace('-', '') + ", \"ogWord\" : \"" + this.ogWord +"\", \"prWord\":\"" + this.prWord + "\", \"trWord\" : \"{\\\"en\\\" : \\\"" + this.trWord.get('en') + "\\\", \\\"es\\\" : \\\"" + this.trWord.get('es') + "\\\"}\"}";
        await (await this.http.postRequest('update_word', JSON.parse(this.body), this.authToken)).subscribe(
          (data) => {        
            this.loading.dismiss();
            if(data['status_code'] == 200) {
              this.navigate('dictionary/view', Number.parseInt(data['word']['languages_id']));
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
