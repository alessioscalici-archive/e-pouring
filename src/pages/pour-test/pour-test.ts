import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Locale, LocalizationService } from 'angular2localization';

import { Measure } from '../../models/measure.model';
import { PourTest } from '../../models/pour-test.model';
import { FreePouringService } from '../free-pouring/free-pouring.service';

@Component({
  selector: 'pour-test-page',
  templateUrl: 'pour-test.html',
  providers: [FreePouringService]
})
export class PourTestPage extends Locale {

  stopPouringSub: Subscription;

  testList: Array<PourTest>;
  currentIndex: number = 0;
  currentTest: PourTest;
  testPhase: string;



  constructor(
      public localization: LocalizationService,
      public freePouringService: FreePouringService
  ) {
    super(null, localization);


    this.testList = [
      new PourTest(Measure.list[4]),
      new PourTest(Measure.list[1]),
      new PourTest(Measure.list[2]),
      new PourTest(Measure.list[5]),
      new PourTest(Measure.list[3]),
      new PourTest(Measure.list[0]),
      new PourTest(Measure.list[7])
    ];

    this.freePouringService.toggleAccelerometer();

    this.testPhase = 'TO_BEGIN';
  }


  private isLastTest() :boolean {
    return (this.currentIndex === (this.testList.length - 1));
  }

  private goToNextTest() {
    if (!this.isLastTest()) {
      ++this.currentIndex;
      this.currentTest = this.testList[this.currentIndex];
    }
  }



  startTest() {

    this.testPhase = 'ONGOING';
    this.currentIndex = 0;
    this.currentTest = this.testList[this.currentIndex];

    this.stopPouringSub = this.freePouringService.watchStopPouring().subscribe((stats) => {

      // set the test as done
      this.currentTest.stats = stats;
     // alert(this.currentIndex + '- Accuracy: ' + this.currentTest.getAccuracy());


      if (this.isLastTest()) {
        this.testPhase = 'ENDED';
        this.stopPouringSub.unsubscribe();
        this.currentIndex = 0;
        this.currentTest = null;
      } else {
        this.goToNextTest();
      }


    });


  }
}
