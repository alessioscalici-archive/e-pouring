import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { Locale, LocalizationService } from 'angular2localization';

import { PourTestSuite } from '../../models/pour-test-suite.model';

@Component({
  selector: 'pour-test-result-page',
  templateUrl: 'pour-test-result.html',
  providers: []
})
export class PourTestResultPage extends Locale {


  testSuite: PourTestSuite;

  constructor(
      public localization: LocalizationService,
      public navParams: NavParams
  ) {
    super(null, localization);

    this.testSuite = navParams.get('testSuite');

  }
}
