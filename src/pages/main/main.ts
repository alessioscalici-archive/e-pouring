import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

import { Locale, LocalizationService } from 'angular2localization';


@Component({
  selector: 'main-page',
  templateUrl: 'main.html'
})
export class MainPage extends Locale {
  constructor(
      public localization: LocalizationService
  ) {
    super(null, localization);

  }
}
