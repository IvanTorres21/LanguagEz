import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { Language } from '../../../Models/language';
import { Lesson } from '../../../Models/lesson';

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
    private loadingC : LoadingController,
    private activatedRoute : ActivatedRoute) {
      db.init();
    
   }

   
  public loading;
  public id : string;
  public language : Language = new Language;;
  public lessons : Lesson[] = [];
  public tests : Lesson[] = [];
  private helper : JSON[] = [];
  private authToken : string;
  public failed : boolean = false;

  async ionViewDidEnter() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.lessons = [];
    this.tests = [];
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });

    this.loading.present();
    this.initializeData();
  }

  // Initializes elements
  async initializeData() {
     // Prepare loading
    
    this.authToken = await this.db.get('auth');
     //Get lessons from the DB
     await (await this.http.postRequest('get_language_lessons', JSON.parse("{\"id\" : "+ this.id + "}") ,this.authToken)).subscribe((value) => {
       if(value['status_code'] == 200) { 
         this.language.name = JSON.parse(JSON.stringify(value['language']['name']));
         this.language.id = value['language']['id'];
         this.language.image = value['language']['image'];
          this.helper = value['language']['lessons'];
          this.helper.forEach(element => {
            var lesson = new Lesson;
            lesson.title = element['title'];
            lesson.theory = element['theory'];
            lesson.id = element['id'];
            this.lessons.push(lesson);
          }
          
          );
       } else {
          this.failed = true;
       }
       console.log(this.lessons);
     },
     async (error) => {
      if(error.status == 401) {
        await this.db.set('auth', null);
        this.loading.dismiss();
        this.navigate('login', undefined);
      } else {
              this.failed = true;
            }
            
          });
     //Get tests from the DB
     await (await this.http.postRequest('get_tests', JSON.parse("{\"id\" : "+ this.id + "}") ,this.authToken)).subscribe((value) => {
      if(value['status_code'] == 200) { 
         this.helper = [];
         this.helper = value['lessons']['tests'];
         this.helper.forEach(element => {
           var test = new Lesson;
           test.title = element['name'];
           test.id = element['id'];
           this.tests.push(test);
         });
      } else {
         this.failed = true;
      }
      this.loading.dismiss();
      console.log(this.tests);
    },
    async (error) => {
      if(error.status == 401) {
        await this.db.set('auth', null);
        this.loading.dismiss();
        this.navigate('login', undefined);
      } else {
        this.failed = true;
      }
      
    });

    
    
    
    
  }
  

  // Deletes a lesson
  async delete(lesson : Lesson, isLesson : boolean) {
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.loading.present();
    if(isLesson) 
      await this.http.postRequest('delete_lesson', JSON.parse("{\"id\" : " + lesson.id +"}"), this.authToken).subscribe((data) => {
        this.lessons = [];
        this.initializeData();
      });
    else 
      await this.http.postRequest('delete_test', JSON.parse("{\"id\" : " + lesson.id +"}"), this.authToken).subscribe((data) => {
        this.lessons = [];
        this.initializeData();
      });
  }

  // Manages all redirects
  navigate(route : string, id : number) {
    this.router.navigateByUrl(`/${route}${id != undefined ? '/' + id: ''}`);
  }

}
