import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { Language } from '../../../Models/language';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Word } from '../../../Models/word';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage {

  constructor(
    private db : DatabaseService, 
    private http : HttpRequestsService,
    private router : Router,
    private loadingC : LoadingController,
    private activatedRoute : ActivatedRoute) {
    db.init();
    
   }

  public loading;
  public words : Word[] = [];
  private helper : JSON[] = [];
  private authToken : string;
  private id : string;
  public dicId : number;
  public failed : boolean = false;

  async ionViewDidEnter() {
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.words = [];
    this.loading.present();
    this.initializeData();
  }

  // Initializes elements
  async initializeData() {
     // Prepare loading
    
    this.authToken = await this.db.get('auth');
     //Get languages from the DB
     this.id = this.activatedRoute.snapshot.paramMap.get("id");
     this.dicId = Number.parseInt(this.id);
     await (await this.http.postRequest('dictionary', JSON.parse("{\"id\" : " + this.id + "}"), this.authToken)).subscribe((value) => {
       if(value['status_code'] == 200) {
          this.helper = value['dictionary'];
          this.helper.forEach(element => {
            var word = new Word;
            word.ogWord = element['og_word'];
            word.prWord = element['pr_word'];
            word.trWord = element['tr_word'];
            word.id = element['id']
            this.words.push(word);
          });
       } else {
          this.failed = true;
       }
       this.loading.dismiss();
     },
     async (error) => {
       if(error.status == 401) {
         await this.db.set('auth', null);
         this.loading.dismiss();
         this.navigate('login', undefined);
       }
     });
     
  }

  // Deletes a language
  async delete(word : Word) {
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.loading.present();
    await this.http.postRequest('delete_word', JSON.parse("{\"id\" : " + word.id +"}"), this.authToken).subscribe((data) => {
      this.words = [];
      this.initializeData();
    });
  }

  // Manages all redirects
  navigate(route : string, id : number) {
    this.router.navigateByUrl(`/${route}${id != undefined ? '/' + id: ''}`);
  }
}

