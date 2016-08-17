import {Component, ViewChild, ChangeDetectorRef} from "@angular/core";
import {NavController, Slides, ToastController} from 'ionic-angular';
import { DBMeter } from 'ionic-native';

import {StorageProvider, Question} from '../../providers/storage/storage';
import {QuestionsPage} from '../questions/questions';

declare let require: any;
require('./Chart')
declare let Chart: any;


declare module TTS {
  interface IOptions {
    text: string;
    locale?: string;
    rate?: number;
  }
  function speak(options: IOptions, onfulfilled: () => void, onrejected: (reason) => void): void;
  function speak(text: string, onfulfilled: () => void, onrejected: (reason) => void): void;
}

const arr10: Array<number> = Array(10).fill(0)

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  questions: Array<Question> = [];
  candidate: string = 'Candidate';
  calibratedDb: number = 0.0;
  currentDb: number = 0.0;
  currentDbArr: Array<number> = arr10
  playing: boolean = false;
  speaking: boolean = false;
  loading: boolean = false;
  @ViewChild('qSlider') slider: Slides;

  constructor(public navCtrl: NavController, private ref: ChangeDetectorRef, public storage: StorageProvider, private toast: ToastController) {
    let index = 0;
    let subscription = DBMeter.start().subscribe(data => {
      this.currentDb = parseFloat(data);
      this.currentDbArr[index] = this.currentDb;
      index++;
      if (index === 10) index = 0;
      // this.ref.detectChanges();
    });
    this.storage.getKV('candidate').then((value) => {
      if (typeof value === 'string') {
        this.candidate = value;
      } else {
        this.presentToast('Please set your name.')
        this.navCtrl.setRoot(HomePage);
      }
    });
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

  public calibrate() {
    let sum: number = 0;
    let count: number = 0;
    this.loading = true;
    let calibrateInterval = window.setInterval(() => {
      sum += this.currentDb;
      count++;
      if (count > 9) {
        this.calibratedDb = sum / count;
        this.storage.setKV('calibratedDb', this.calibratedDb);
        this.loading = false;
        clearInterval(calibrateInterval);
      }
    }, 200);
  }

  public toggleInterview() {
    if (!this.slider.isBeginning()) this.slider.slideTo(0);
    this.playing = !this.playing;
    setTimeout(() => {
      if (this.playing) {
        TTS.speak(`All right, let's do this. I wish you best of luck ${this.candidate}.`,
          () => {
            TTS.speak(this.questions[0].question,
              () => this.askNextQuestion(),
              err => console.error(err));
          },
          err => console.error(err));
      }
    }, 500)
  }

  askNextQuestion() {
    let isNotAnswering: number = 0;
    let askInterval = setInterval(() => {
      if (this.playing) {
        if (this.currentDb - this.calibratedDb < 10) {
          isNotAnswering++;
        } else {
          isNotAnswering = 0;
        }
        if (isNotAnswering > 15) {
          isNotAnswering = 0;
          if (this.slider.isEnd()) {
            TTS.speak(`That was the last question for you. Thank you very much ${this.candidate}.`,
              () => {
                this.playing = false;
                clearInterval(askInterval);
                this.slider.slideTo(0);
              },
              err => console.error(err));
          } else {
            this.slider.slideNext();
          }
        }
      } else {
        isNotAnswering = 0;
        clearInterval(askInterval);
      }
    }, 100);
  }

  onSlideChanged() {
    if (this.playing) {
      let slideIndex = this.slider.getActiveIndex();
      TTS.speak(this.questions[slideIndex].question,
        () => console.log('done asking'),
        err => console.error(err));
    }
  }

  presentToast(message: string) {
    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  ionViewDidEnter() {
    this.loadQuestions();

    this.storage.getKV('calibratedDb').then((value) => {
      if (value !== undefined) {
        this.calibratedDb = +value;
      } else {
        this.presentToast('Please calibrate the noise level.')
      }
    });

    let canvas: any = document.getElementById('sparkLine');
    let ctx: any = canvas.getContext('2d');

    let dataSet = {
      fill: false,
      borderColor: 'rgba(255,255,255, 0.7)',
      borderWidth: 1,
      pointRadius: 0,
      data: arr10
    }

    let data = {
      labels: arr10,
      datasets: Array(Object.assign({}, dataSet, { data: arr10 }), dataSet)
    };

    let options = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      }
    };

    let sparkLine = new Chart(ctx, {
      type: 'line',
      data,
      options
    });

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    window.setInterval(() => {
      sparkLine.data.datasets[0].data = Array(10).fill(this.calibratedDb)
      sparkLine.data.datasets[1].data = this.currentDbArr;
      sparkLine.update();
    }, 10)
  }
}
