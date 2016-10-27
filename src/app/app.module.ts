import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { FreePouringPage } from '../pages/free-pouring/free-pouring';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    FreePouringPage
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
