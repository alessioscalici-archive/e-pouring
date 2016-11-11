import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { LocaleModule, LocalizationModule } from 'angular2localization';

import { MyApp } from './app.component';
import { MainPage } from '../pages/main/main';
import { FreePouringPage } from '../pages/free-pouring/free-pouring';

import { ExactoPour } from '../components/exacto-pour/exacto-pour';
import { InclinationRoundDisplay } from '../components/inclination-round-display/inclination-round-display';
import { PourReportText } from '../components/pour-report-text/pour-report-text';

@NgModule({
  declarations: [
    MyApp,
    MainPage,
    FreePouringPage,
    ExactoPour,
    InclinationRoundDisplay,
    PourReportText
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
    FreePouringPage
  ],
  providers: []
})
export class AppModule {}
