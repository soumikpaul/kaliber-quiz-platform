import { Component, OnInit } from '@angular/core';
import { QuizInventoryService } from 'src/app/services/quiz-inventory.service';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import * as lodash from 'lodash';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LoggerService } from 'src/app/services/logger.service';
import { TermsModalComponent } from '../../terms-modal/terms-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard = 'dashboard';
  quizzes: any = [];
  newQuizzes = [];
  myquizzes;
  userProfile;
  userAvatar;
  opened = false;
  loaded = false;
  page = 0;
  limit = 100;
  count = 0;
  res;
  quizzesData: any;
  public errorMsg = '';
  quizList: any = [];
  quizData;
  quizTempData;
  quizArray = [];
  quizFollowData;
  myQuizArray = [];
  quizDATA2;
  userDetails;
  openstatus: boolean;
  userName;
  name: any;
  constructor(
    private quizInventory: QuizInventoryService,
    private userService: UserService,
    private logger: LoggerService,
    private dialog: MatDialog) {
  }

  // ngOnInit() {
  //   this.getQuizzes();
  // }
  ngOnInit() {
    this.userService.getUserProfile().subscribe(data => {
      this.res = data;
      // const url = `kaliber-quiz-inventory/quizfeed/${this.res.username}`;
      // this.quizInventory.getPaginatedQuizzes(url).subscribe(mydata => {
      //   this.quizData = mydata;
      //   console.log('DASHBOARD DATA:: ---> ', mydata);
      //   this.quizTempData = this.quizData.result;
      //   console.log('value in ::-->', this.quizData.result);

      //   for (const key in this.quizTempData) {
      //     if (this.quizTempData.hasOwnProperty(key)) {
      //       const val = this.quizTempData[key];
      //       console.log(val, ' value of quizCode');
      //       console.log(key, 'Quiz code of the quiz as key');
      //     }
      //     const url2 = `kaliber-quiz-inventory/quizzes?quizCode=${key}`;
      //     this.quizInventory.getPaginatedQuizzes(url2).subscribe(t => {
      //       this.quizFollowData = t;

      //       this.quizFollowData = this.quizFollowData.result[0];
      //       this.quizFollowData.createDate =  moment(this.quizFollowData.createDate).fromNow();
      //       this.quizFollowData.players = this.quizTempData[key];
      //       this.myQuizArray.push(this.quizFollowData);
      //       this.myQuizArray = lodash.orderBy(this.myQuizArray, ['createDate'], ['desc']);
      //       console.log(this.myQuizArray);
      //     });
      //   }
      //   console.log(this.myQuizArray);
      //   console.log('my::: =---> ', mydata);
      // });


      this.userDetails = data;
      if (this.userDetails.termsaccepted === true) {
        this.getQuizzes();
      } else {
        const dialogRef = this.dialog.open(TermsModalComponent);
        dialogRef.afterClosed().subscribe(mdata => {
          this.getQuizzes();
        });
      }
      // this.userName = this.userDetails.username;
      this.name = this.userDetails.name;
      console.log('<-----------name-------->', this.name);
    });
  }


  // getQuizzes() {
  //   this.quizInventory.getQuizzes().subscribe(
  //     res => {
  //       this.loaded = true;
  //       this.quizzesData = res;
  //       this.quizList = this.quizzesData.result;
  //       this.count = this.quizzesData.count;
  //       this.quizList = this.quizList.filter((data) => {
  //         this.logger.log(data.statusvalue, ' status Value of quiz');
  //         return (data.statusvalue === 'OPEN');
  //       });
  //       this.logger.log('qlist', this.quizList);

  //       this.quizzes = this.quizList.map(data => {
  //         data.createDate = moment(data.createDate).fromNow();
  //         return data;
  //       });
  //       this.quizzes.forEach(element => {
  //         this.userService.getByUserName(element.createdBy).subscribe(response => {
  //           this.userProfile = response;
  //           this.userProfile = this.userProfile.result;
  //           this.userAvatar = this.userProfile.avatarURL;
  //           element.userImage = this.userAvatar;
  //           element.name = this.userProfile.name;
  //         });
  //         this.addConcept();
  //       },
  //       error => {
  //         this.loaded = true;
  //         this.errorMsg = error;
  //       }
  //     );
  //   });
  // }

getQuizzes() {
  this.userService.getUserProfile().subscribe(data => {
    this.res = data;
    this.loaded = true;
    const url = `kaliber-quiz-inventory/quizfeed/${this.res.username}`;
    this.quizInventory.getPaginatedQuizzes(url).subscribe(mydata => {
      this.quizData = mydata;
      // console.log('DASHBOARD DATA:: ---> ', mydata);
      this.quizTempData = this.quizData.result;
      // console.log('value in ::-->', this.quizData.result);

      for (const key in this.quizTempData) {
        if (this.quizTempData.hasOwnProperty(key)) {
          const val = this.quizTempData[key];
          this.count ++;
          // console.log(this.count);
          // console.log(val, ' value of quizCode');
          // console.log(key, 'Quiz code of the quiz as key');
        }
        const url2 = `kaliber-quiz-inventory/quizzes?quizCode=${key}`;
        this.quizInventory.getPaginatedQuizzes(url2).subscribe(t => {
          this.quizFollowData = t;

          this.quizFollowData = this.quizFollowData.result[0];
          this.quizFollowData.createDate =  moment(this.quizFollowData.createDate).fromNow();
          this.quizFollowData.players = this.quizTempData[key];
          this.myQuizArray.push(this.quizFollowData);
          this.myQuizArray = lodash.orderBy(this.myQuizArray, ['createDate'], ['desc']);
          console.log(this.myQuizArray);
          this.addConcept();
        });
      }
      // console.log(this.myQuizArray);
      // console.log('my::: =---> ', mydata);
    });


    // this.userDetails = data;
    // if (this.userDetails.termsaccepted === true) {
    //   this.getQuizzes();
    // } else {
    //   const dialogRef = this.dialog.open(TermsModalComponent);
    //   dialogRef.afterClosed().subscribe(mdata => {
    //     this.getQuizzes();
    //   });
    // }
    // this.userName = this.userDetails.username;
    this.name = this.userDetails.name;
  });
}





  public onScroll(): void {
    this.logger.log('INSIDE ONSCROLLDOWN');
    this.page += 1;
    if (this.count > this.quizzes.length) {
      const url = `kaliber-quiz-inventory/quizzes?page=${this.page}&limit=${this.limit}`;
      this.quizInventory.getPaginatedQuizzes(url).subscribe(
        (res) => {
          this.myquizzes = res;
          this.logger.log(this.myquizzes.result, '::quiz details');
          this.newQuizzes = this.myquizzes.result.filter((data) => {
            this.logger.log(data.statusvalue, ' status Value of quiz');
            return (data.statusvalue === 'OPEN');
          });
          this.newQuizzes.forEach(element => {
            element.createDate = moment(element.createDate).fromNow();
            this.quizzes.push(element);
          });
          this.quizzes.forEach(element => {
            this.userService.getByUserName(element.createdBy).subscribe(response => {
              this.userProfile = response;
              this.userProfile = this.userProfile.result;
              this.logger.log(this.userProfile);
              this.userAvatar = this.userProfile.avatarURL;
              element.userImage = this.userAvatar;
            });
            this.logger.log('quiz', this.quizzes);
          });
          this.addConcept();
        });
    }
  }


addConcept() {
    // tslint:disable-next-line: no-shadowed-variable
    this.myQuizArray.forEach(element => {
      if (element.concepts != null) {
        if (element.concepts.length > 3) {
          element.firstThreeAvatarIcon = element.concepts.slice(0, 3);
        }
        if (element.concepts.length > 0) {
          element.firstThreeConcepts = element.concepts.slice(0, 3);
        }
      }
    });
    this.logger.log(this.quizzes);
  }

opendrawer() {
    this.openstatus = true;
  }

  public _toggleSidebar() {
    this.opened = !this.opened;
  }
  public _toggleOpened(): void {
    this.opened = !this.opened;
  }
}
