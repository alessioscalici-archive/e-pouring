import { Component } from '@angular/core';

import { Locale, LocalizationService } from 'angular2localization';

@Component({
  templateUrl: 'main.html'
})
export class MainPage extends Locale {
  constructor(
      public localization: LocalizationService
  ) {
    super(null, localization);
  }
}
