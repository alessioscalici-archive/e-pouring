import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { LocaleModule, LocalizationModule } from 'angular2localization';

import { MyApp } from './app.component';
import { MainPage } from '../pages/main/main';
import { FreePouringPage } from '../pages/free-pouring/free-pouring';
import { PourTestPage } from '../pages/pour-test/pour-test';

import { ExactoPour } from '../components/exacto-pour/exacto-pour';
import { InclinationRoundDisplay } from '../components/inclination-round-display/inclination-round-display';
import { PourReport } from '../components/pour-report/pour-report';


@NgModule({
  declarations: [
    MyApp,
    MainPage,
    FreePouringPage,
    PourTestPage,
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
    PourTestPage
  ],
  providers: []
})
export class AppModule {}
