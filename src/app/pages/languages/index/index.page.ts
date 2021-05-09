import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { Language } from '../../../Models/language';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage {

  constructor(
    private db : DatabaseService, 
    private http : HttpRequestsService,
    private router : Router) {
    db.init();
   }

  public languages : Language[] = [];
  private language : Language = new Language;
  private authToken : string;


  ionViewDidEnter(){
    this.languages = [];
    this.initializeData();
    // Delete all this, its just a placeholder
    this.language.id = 1;
    this.language.name = JSON.parse("{\"en\" : \"Spanish\", \"es\" : \"Español\"}");
    this.language.image = "https://cdn.britannica.com/36/4336-050-056AC114/Flag-Spain.jpg";
    this.languages.push(this.language);
    this.languages.push(this.language);
    this.languages.push(this.language);
    this.languages.push(this.language);
  }

  // Initializes elements
  async initializeData() {
    this.authToken = await this.db.get('auth');
     //Get languages from the DB
  }

  // Manages all redirects
  navigate(route : string, id : number) {
    this.router.navigateByUrl(`/${route}${id != undefined ? '/' + id: ''}`);
  }
}
