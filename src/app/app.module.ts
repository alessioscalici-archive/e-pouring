import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { LocaleModule, LocalizationModule } from 'angular2localization';

import { MyApp } from './app.component';
import { MainPage } from '../pages/main/main';
import { FreePouringPage } from '../pages/free-pouring/free-pouring';
import { PourTestPage } from '../pages/pour-test/pour-test';
import { PourTestResultPage } from '../pages/pour-test-result/pour-test-result';
import { PourTestHistoryPage } from '../pages/pour-test-history/pour-test-history';

import { ExactoPour } from '../components/exacto-pour/exacto-pour';
import { InclinationRoundDisplay } from '../components/inclination-round-display/inclination-round-display';
import { PourReport } from '../components/pour-report/pour-report';

import { Db } from '../services/Db.service';


@NgModule({
  declarations: [
    MyApp,
    MainPage,
    FreePouringPage,
    PourTestPage,
    PourTestResultPage,
    PourTestHistoryPage,
    ExactoPour,
    InclinationRoundDisplay,
    PourReport
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    LocaleModule.forRoot(),
    LocalizationModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainPage,
    FreePouringPage,
    PourTestPage,
    PourTestResultPage,
    PourTestHistoryPage
  ],
  providers: [
    Db
  ]
})
export class AppModule {}
