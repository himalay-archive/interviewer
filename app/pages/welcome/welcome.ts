import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Keyboard } from 'ionic-native';

import {StorageProvider} from '../../providers/storage/storage';
import {HomePage} from '../home/home';

@Component({
  templateUrl: 'build/pages/welcome/welcome.html',
})
export class WelcomePage {
  candidate: string;
  loading: boolean = false;

  constructor(private navCtrl: NavController, public storage: StorageProvider) {}

  public openHome () {
    Keyboard.close()
    this.loading = true;
    this.storage.setKV('candidate', this.candidate);
    setTimeout(() => {
      this.navCtrl.setRoot(HomePage);
    }, 1000)
  }
}
