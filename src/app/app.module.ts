import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { LocaleModule, LocalizationModule } from 'angular2localization';

import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { FreePouringPage } from '../pages/free-pouring/free-pouring';

import { ExactoPour } from '../components/exacto-pour/exacto-pour';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    FreePouringPage,
    ExactoPour
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    LocaleModule.forRoot(),
    LocalizationModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    FreePouringPage
  ],
  providers: []
})
export class AppModule {}
