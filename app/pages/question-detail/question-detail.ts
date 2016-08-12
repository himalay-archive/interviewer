import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import {StorageProvider, Question} from '../../providers/storage/storage';

@Component({
  templateUrl: 'build/pages/question-detail/question-detail.html',
})
export class QuestionDetailPage {
  question: Question;

  constructor(private nav: NavController, navParams: NavParams, private toast : ToastController, public storage: StorageProvider) {
    let arg = navParams.get('question');

    if (arg !== undefined) {
      this.question = arg;
    } else {
      this.question = new Question('', null);
    }
  }

  saveQuestion() {
    if (this.question.id === null) {
      if (this.question.question.length > 5) {
        this.storage.create(this.question).then(({res}) => {
          //this.question.id = res['insertId'];
          this.presentToast();
        });
      }
    } else {
      this.storage.update(this.question);
      this.presentToast();
    }
  }

  presentToast () {
    let toast = this.toast.create({
      message: 'Question saved',
      duration: 3000
    });
    toast.present();
  }

  ionViewWillUnload() {
    this.saveQuestion();
  }
}
