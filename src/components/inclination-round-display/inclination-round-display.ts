import { Component, Input, SimpleChanges } from '@angular/core';
import { List, Item } from 'ionic/ionic';
import { Platform } from 'ionic-angular';
import { DeviceMotion, AccelerationData } from 'ionic-native';
import { Subscription } from 'rxjs/Subscription';

import { AppConfig } from '../../app/app-config.service';

@Component({
    selector: 'inclination-round-display',
    templateUrl: 'inclination-round-display.html'
})
export class InclinationRoundDisplay {

    @Input() active: boolean;

    subscription: Subscription;
    inclination : number = 0;
    leftHand: boolean;
    isCorrectInclination: boolean;
    isWrongInclination: boolean;



    constructor(public platform: Platform) {


    }


    private activate() {
        if (!DeviceMotion) {
            return;
        }

        // FIXME frequency to config
        this.subscription = DeviceMotion.watchAcceleration({frequency: 50})
            .subscribe((a:AccelerationData) => {

                // we won't consider the z axis in normalization
                // Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
                let norm = Math.sqrt(a.x * a.x + a.y * a.y);
                // normalized vector
                //   let n = {
                //       x: a.x / norm,
                //       y: a.y / norm,
                //       z: a.z / norm,
                //   };


                let incl = Math.acos(a.y / norm);

                // round to smoothen animation
                this.inclination = +incl.toFixed(2);

                // FIXME inclinations to config
                this.isCorrectInclination = (this.inclination >= Math.PI - (Math.PI / 6));
                this.isWrongInclination = !this.isCorrectInclination && (this.inclination >= (Math.PI / 2));

                this.leftHand = (a.x < 0);


            });
    }

    private deactivate() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.inclination = 0;
    }


    ngOnChanges(changes: SimpleChanges) {

        if (changes) {
            if (changes['active'].currentValue) {
                this.activate();
            } else {
                this.deactivate();
            }
        }
    }

}