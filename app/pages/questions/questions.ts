import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {StorageProvider, Question} from '../../providers/storage/storage';
import {QuestionDetailPage} from '../question-detail/question-detail';

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

  public reorderQuestions(indexes) {
    let element: Question = this.questions[indexes.from];
    this.questions.splice(indexes.from, 1);
    this.questions.splice(indexes.to, 0, element);
  }

  public addQuestion() {
    this.navCtrl.push(QuestionDetailPage);
  }

  public updateQuestion(q: Question) {
    this.navCtrl.push(QuestionDetailPage, {'question': q});
  }

  ionViewDidEnter () {
    this.loadQuestions();
  }
}
