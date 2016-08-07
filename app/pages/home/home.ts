import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {StorageProvider, Question} from '../../providers/storage/storage';
import {QuestionsPage} from '../questions/questions';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  questions: Array<Question> = [];

  constructor(public navCtrl: NavController, public storage : StorageProvider) {
    let sampleQuestion: Array<Question> = [new Question('What is the question?', null), new Question('What is your answer?', null)];
    sampleQuestion.forEach(q => this.storage.create(q).then(() => console.log('question added'), err => console.error(err)));
  }

  private loadQuestions() {
    this.storage.get()
    .then((questions: Array<Question>) => {
      this.questions = questions;
    });
  }

  public openQuestions() {
    this.navCtrl.push(QuestionsPage);
  }

  ionViewDidEnter () {
    this.loadQuestions();
  }
}
