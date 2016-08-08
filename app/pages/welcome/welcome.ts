import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {StorageProvider} from '../../providers/storage/storage';
import {HomePage} from '../home/home';

@Component({
  templateUrl: 'build/pages/welcome/welcome.html',
})
export class WelcomePage {
  candidate: string;

  constructor(private navCtrl: NavController, public storage: StorageProvider) {}

  public openHome () {
    this.storage.setKV('candidate', this.candidate);
    this.navCtrl.setRoot(HomePage);
  }
}
