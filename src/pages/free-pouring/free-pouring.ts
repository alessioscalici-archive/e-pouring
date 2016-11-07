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

    startPouringSub: Subscription;
    stopPouringSub: Subscription;
    isSubscribed: Boolean;
    isPouring: Boolean;
    phaseColor: String;
    quantity: Number;




    constructor(
        private freePouringService: FreePouringService,
        public localization: LocalizationService) {

        super(null, localization);
    }


    toggleAccelerometer () {


        // FIXME DEBUGGING SUBSCRIPTION
        if (this.isSubscribed) {
            this.isSubscribed = false;
            this.startPouringSub.unsubscribe();
            this.stopPouringSub.unsubscribe();
        } else {
            this.isSubscribed = true;


            this.startPouringSub = this.freePouringService.watchStartPouring().subscribe(() => {

                this.phaseColor = 'green';
                this.isPouring = true;

            });

            this.stopPouringSub = this.freePouringService.watchStopPouring().subscribe((stats) => {

                // FIXME pick another phase indicator
                this.phaseColor = 'white';
                this.isPouring = false;

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
            });
        }

        this.freePouringService.toggleAccelerometer();
    }

}