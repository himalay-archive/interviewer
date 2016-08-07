import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {StorageProvider, Question} from '../../providers/storage/storage';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  questions: Array<Question> = [];

  constructor(public navCtrl: NavController, public  storage : StorageProvider) {
    let sampleQuestion = new Question('What is the question?', null);
    this.storage.create(sampleQuestion).then(() => console.log('question added'), err => console.error(err));
  }

  private loadQuestions() {
    this.storage.get()
    .then((questions: Array<Question>) => {
      this.questions = questions;
    });
  }

  ionViewDidEnter () {
    this.loadQuestions();
  }
}
