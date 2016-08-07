import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {StorageProvider, Question} from '../../providers/storage/storage';

@Component({
  templateUrl: 'build/pages/questions/questions.html',
})
export class QuestionsPage {
  questions: Array<Question> = [];

  constructor(private navCtrl: NavController, public storage : StorageProvider) {

  }

  private loadQuestions() {
    this.storage.get()
    .then((questions: Array<Question>) => {
      this.questions = questions;
    });
  }

  reorderQuestions(indexes) {
    let element = this.questions[indexes.from];
    this.questions.splice(indexes.from, 1);
    this.questions.splice(indexes.to, 0, element);
  }

  ionViewDidEnter () {
    this.loadQuestions();
  }
}
