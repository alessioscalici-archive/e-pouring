import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { LocaleService, LocalizationService } from 'angular2localization';
import { Observable } from 'rxjs/Rx';

import { MainPage } from '../pages/main/main';
import { FreePouringPage } from '../pages/free-pouring/free-pouring';
import { PourTestPage } from '../pages/pour-test/pour-test';
import { PourTestHistoryPage } from '../pages/pour-test-history/pour-test-history';

import { StorageService } from '../services/storage.service';

@Component({
  templateUrl: 'app.html',
  providers: [StorageService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = MainPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public locale: LocaleService,
    public localization: LocalizationService,
    public storage: StorageService
  ) {
    this.initializeApp();
    this.initializePages();
    this.initializeTranslation();
    this.initializeDb();
  }


  initializePages() {

    this.localization.translationChanged.subscribe(() => {
      this.pages = [
        {
          title: this.localization.translate('pages.main'),
          component: MainPage
        },
        {
          title: this.localization.translate('pages.freePouring'),
          component: FreePouringPage
        },
        {
          title: this.localization.translate('pages.pourTest'),
          component: PourTestPage
        },
        {
          title: this.localization.translate('pages.pourTestHistory'),
          component: PourTestHistoryPage
        }
      ];
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  initializeTranslation() {
    this.platform.ready().then(() => {

      // Adds a new language (ISO 639 two-letter or three-letter code).
      this.locale.addLanguage('en');
      this.locale.addLanguage('it');
      // Add a new language here.

      this.locale.useLocalStorage(); // To store the user's chosen language, prefer Local Storage.

      // Required: default language.
      // Selects the current language of the browser/user if it has been added, else the default language.
      this.locale.definePreferredLanguage('en');

      // Initializes LocalizationService: asynchronous loading.
      this.localization.translationProvider('./assets/i18n/'); // Required: initializes the translation provider with the given path prefix.


      this.localization.updateTranslation(); // Need to update the translation.


      let lang = (navigator.language && navigator.language.split('-')[0]) || 'en';
      this.locale.setCurrentLanguage(lang);

    });
  }

  initializeDb() {
    this.platform.ready().then(() => {
     // this.storage.clear().then(()=>{
        this.storage.init();
     // });
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
