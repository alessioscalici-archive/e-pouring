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
    quantity: number;




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


            let text = '';

            // never been in right position
            if (stats.isTotalWrongPosition) {
                text += this.localization.translate('freePouring.youPoured', stats) + '\n';
                text += this.localization.translate('freePouring.wrongInclination') + '\n';
            } else {

                text += this.localization.translate('freePouring.youPoured', stats) + '\n';
                text += this.localization.translate(
                    stats.isGoodOpening ? 'freePouring.goodOpening' : 'freePouring.badOpening',
                    stats) + '\n';
                text += this.localization.translate(
                    stats.isGoodClosing ? 'freePouring.goodClosing' : 'freePouring.badClosing',
                    stats) + '\n';

                text += stats.bubbleHappened ?
                    this.localization.translate('freePouring.bubbleHappened') + '\n' :
                    '';
            }

            this.quantity = stats.quantity;

            alert(text);
        } );
    }

}