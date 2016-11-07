import { Component } from '@angular/core';
import { DeviceMotion } from 'ionic-native';
import { Subscription } from 'rxjs/Subscription';
import { AccelerationData } from 'ionic-native';

import { Locale, LocalizationService } from 'angular2localization';

import { FreePouringService } from './free-pouring.service';


@Component({
    selector: 'free-pouring-page',
    templateUrl: 'free-pouring.html',
    providers: [FreePouringService]
})
export class FreePouringPage extends Locale {


    subscription: Subscription;
    isSubscribed: boolean;
    phaseColor: string;
    percent: number;

    // FIXME debug
    accX: Number;
    accY: Number;
    accZ: Number;
    dataArray: any;

    constructor(
        private freePouringService: FreePouringService,
        public localization: LocalizationService) {

        super(null, localization);
    }


    toggleAccelerometer () {


        // FIXME DEBUGGING SUBSCRIPTION
        if (this.isSubscribed) {
            this.isSubscribed = false;
            this.subscription.unsubscribe();
        } else  {
            this.isSubscribed = true;

            let that = this;

            this.subscription = DeviceMotion.watchAcceleration({frequency: 50}).subscribe((acceleration:AccelerationData) => {

                that.accX = acceleration.x;
                that.accY = acceleration.y;
                that.accZ = acceleration.z;

                if (acceleration.y > 0) {
                    this.phaseColor = 'white';
                } else if (acceleration.y >= -6.5) {
                    this.phaseColor = 'yellow';
                } else {
                    this.phaseColor = 'green';
                }

            });
        }


        this.freePouringService.toggleAccelerometer( (stats) => {


            this.dataArray = stats.data;

            let text = '';

            // never been in right position
            if (stats.isTotalWrongPosition) {
                text += 'You was in a wrong position for: ' + stats.totalTime + ' ms. BAD\n';
                text += 'Measure: ' + stats.quantityText + ' (' + stats.quantity.toFixed(2) + ')\n';
            } else {
                text += 'Opening: ' + stats.openingTime + ' ms. ' + (stats.isGoodOpening ? 'GOOD' : 'BAD') + '\n';
                text += 'Closing: ' + stats.closingTime + ' ms. ' + (stats.isGoodClosing ? 'GOOD' : 'BAD') + '\n';
                text += stats.bubbleHappened ? 'Bubble happened\n' : '';
                text += stats.wrongPositionTime > 0 ? 'You was in a bad position for: ' + stats.wrongPositionTime + ' ms. BAD\n' : '';
                text += 'Measure: ' + stats.quantityText + ' (' + stats.quantity.toFixed(2) + ')\n';
            }

            text += 'Total: ' + stats.totalTime + '\n';

            let percent = stats.quantity / 2 * 100;
            this.percent = Math.round(Math.min(percent, 110));
            text += 'Percent: ' + this.percent;

            alert(text);
        } );
    }

}