import { Injectable, Inject, EventEmitter } from '@angular/core';
import { DeviceMotion } from 'ionic-native';
import { Subscription } from 'rxjs/Subscription'
import { AccelerationData } from 'ionic-native';

import { Measure } from '../../models/measure.model';
import { PourStats } from '../../models/pour-stats.model';
import { AppConfig } from '../../app/app-config.service';


@Injectable()
export class FreePouringService {

    private subscription: Subscription;
    private isSubscribed: boolean;

    // EVENTS
    private eeStartPouring: EventEmitter<any> = new EventEmitter<any>();
    private eeStopPouring: EventEmitter<PourStats> = new EventEmitter<PourStats>();



    public toggleAccelerometer () :Boolean {

        if (this.isSubscribed) {
            this.isSubscribed = false;
            this.subscription.unsubscribe();
            return false;
        }
        this.isSubscribed = true;

        let pouring = false;

        let pourArray = [];


        this.subscription = DeviceMotion.watchAcceleration({frequency: AppConfig.pouring.tickFrequency})
            .subscribe((acc:AccelerationData) => {

                if (acc.y < 0) {
                    if (!pouring) {
                        pouring = true;
                        this.eeStartPouring.emit();
                    }

                    let norm = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
                    pourArray.push(Math.acos(acc.y / norm));

                } else if (pouring && acc.y >= 0) {
                    pouring = false;
                    let stats = new PourStats(pourArray);
                    pourArray = [];

                    this.eeStopPouring.emit(stats);
                }
            });
        return true;

    }


    public watchStopPouring () : EventEmitter<PourStats> {
        return this.eeStopPouring;
    }

    public watchStartPouring () : EventEmitter<any> {
        return this.eeStartPouring;
    }

}