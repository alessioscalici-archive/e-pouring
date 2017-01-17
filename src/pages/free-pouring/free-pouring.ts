import { Component } from '@angular/core';
import { DeviceMotion, AccelerationData } from 'ionic-native';
import { Subscription } from 'rxjs/Subscription';

import { Platform } from 'ionic-angular';
import { Insomnia } from 'ionic-native';

import { Locale, LocalizationService } from 'angular2localization';

import { FreePouringService } from './free-pouring.service';
import { PourStats } from '../../models/pour-stats.model';


@Component({
    selector: 'free-pouring-page',
    templateUrl: 'free-pouring.html',
    providers: [FreePouringService]
})
export class FreePouringPage extends Locale {

    startPouringSub: Subscription;
    stopPouringSub: Subscription;
    isSubscribed: Boolean;
    isPouring: Boolean;
    quantity: Number;
    stats: PourStats;


    constructor(
        private platform: Platform,
        private freePouringService: FreePouringService,
        public localization: LocalizationService
    ) {

        super(null, localization);
    }



    ngOnInit() {
        this.platform.ready().then(() => {
            Insomnia.keepAwake();
        });
    }

    ngOnDestroy() {
        this.platform.ready().then(() => {
            Insomnia.allowSleepAgain();
        });
    }


    toggleAccelerometer () {


        if (this.isSubscribed) {
            this.isSubscribed = false;
            this.startPouringSub.unsubscribe();
            this.stopPouringSub.unsubscribe();
        } else {
            this.isSubscribed = true;
            this.quantity = 0;
            this.stats = null;

            this.startPouringSub = this.freePouringService.watchStartPouring().subscribe(() => {

                this.isPouring = true;
                this.quantity = 0;
                this.stats = null;
            });

            this.stopPouringSub = this.freePouringService.watchStopPouring().subscribe((stats) => {

                this.stats = stats;
                this.isPouring = false;
                this.quantity = stats.quantity;

            });
        }

        this.freePouringService.toggleAccelerometer();
    }

}