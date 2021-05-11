import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { Language } from '../../../Models/language';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage {

  constructor(
    private db : DatabaseService, 
    private http : HttpRequestsService,
    private router : Router,
    private loadingC : LoadingController) {
    db.init();
    
   }

  public loading;
  public languages : Language[] = [];
  private helper : JSON[] = [];
  private authToken : string;
  public failed : boolean = false;

  async ionViewDidEnter() {
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.languages = [];
    this.loading.present();
    this.initializeData();
  }

  // Initializes elements
  async initializeData() {
     // Prepare loading
    
    this.authToken = await this.db.get('auth');
     //Get languages from the DB
     await (await this.http.getRequest('languages', this.authToken)).subscribe((value) => {
       if(value['status_code'] == 200) {
          this.helper = value['languages'];
          this.helper.forEach(element => {
            var language = new Language;
            language.name = element['name'];
            language.image = element['image'];
            language.id = element['id'];
            this.languages.push(language);
          });
       } else {
          this.failed = true;
       }
       this.loading.dismiss();
     });
     
  }

  // Deletes a language
  async delete(language : Language) {
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.loading.present();
    await this.http.postRequest('delete_language', JSON.parse("{\"id\" : " + language.id +"}"), this.authToken).subscribe((data) => {
      this.languages = [];
      this.initializeData();
    });
  }

  // Manages all redirects
  navigate(route : string, id : number) {
    this.router.navigateByUrl(`/${route}${id != undefined ? '/' + id: ''}`);
  }
}
