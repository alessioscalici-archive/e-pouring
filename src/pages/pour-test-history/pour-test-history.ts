import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Locale, LocalizationService } from 'angular2localization';

import { StorageService } from '../../services/storage.service';
import { PourTestSuite } from '../../models/pour-test-suite.model'

import { PourTestResultPage } from '../pour-test-result/pour-test-result';

@Component({
  selector: 'pour-test-history-page',
  templateUrl: 'pour-test-history.html',
  providers: [StorageService]
})
export class PourTestHistoryPage extends Locale {


  list: Array<PourTestSuite>;

  constructor(
      public localization: LocalizationService,
      public navCtrl: NavController,
      public navParams: NavParams,
      public storage: StorageService
  ) {
    super(null, localization);


    this.storage.getPourTests()
      .then((testList) => {
        this.list = testList;
      });

  }

  openTestSuite(suite: PourTestSuite) {
    this.navCtrl.push(PourTestResultPage, {
      testSuite: suite
    });
  }

  getSuccessClass(suite: PourTestSuite) {
    let perc = suite.getSuccessPercent();
    return perc <= 50 ? 'bad' : perc <= 80 ? 'average' : 'good';
  }
}
