import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { LocaleService, LocalizationService } from 'angular2localization';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { FreePouringPage } from '../pages/free-pouring/free-pouring';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = FreePouringPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public locale: LocaleService,
    public localization: LocalizationService
  ) {
    this.initializeApp();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
     // ...

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

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'Free Pouring Page', component: FreePouringPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
