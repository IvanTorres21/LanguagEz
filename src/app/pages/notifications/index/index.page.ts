import { Notification } from './../../../Models/notification';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { HttpRequestsService } from '../../../services/http-requests.service';
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
  public notifications : Notification[] = [];
  private helper : JSON[] = [];
  private authToken : string;
  public failed : boolean = false;

  async ionViewDidEnter() {
   
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.notifications = [];
    this.loading.present();
    this.initializeData();
   
  }

  // Initializes elements
  async initializeData() {
     // Prepare loading
    
    this.authToken = await this.db.get('auth');
     //Get Notifications from the DB
     await (await this.http.getRequest('get_notifications', this.authToken)).subscribe((value) => {
       if(value['status_code'] == 200) {
          this.helper = value['notifications'];
          this.helper.forEach(element => {
            var notification = new Notification;
            notification.title = element['title'];
            notification.content = element['content'];
            notification.id = element['id'];
            this.notifications.push(notification);
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
  async delete(notification : Notification) {
    this.loading = await this.loadingC.create({
      message: 'Please wait...'
    });
    this.loading.present();
    await this.http.postRequest('delete_notification', JSON.parse("{\"id\" : " + notification.id +"}"), this.authToken).subscribe((data) => {
      this.notifications = [];
      this.initializeData();
    });
  }

  // Manages all redirects
  navigate(route : string, id : number) {
    this.router.navigateByUrl(`/${route}${id != undefined ? '/' + id: ''}`);
  }
}
