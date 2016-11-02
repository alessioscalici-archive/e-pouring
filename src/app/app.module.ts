import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
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
    IonicModule.forRoot(MyApp)
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
