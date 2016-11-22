import { Injectable, Inject, EventEmitter } from '@angular/core';
import { DeviceMotion } from 'ionic-native';
import { Subscription } from 'rxjs/Subscription'
import { AccelerationData } from 'ionic-native';

import { Measure } from '../../models/measure.model';
import { PourStats } from '../../models/pour-stats.model';
import { AppConfig } from '../../app/app-config.service';


enum PouringPhase {
    OPENING = 1,
    CLOSING,
    WRONG_POSITION,
    POURING
}


@Injectable()
export class FreePouringService {

    private subscription: Subscription;
    private isSubscribed: boolean;

    // EVENTS
    private eeStartPouring: EventEmitter<any> = new EventEmitter<any>();
    private eeStopPouring: EventEmitter<PourStats> = new EventEmitter<PourStats>();




    public calculateData (baseArray) :Array<any> {
        let neverCorrectPosition = true;
        let newArray =  baseArray.map(function (inclination) {

            //let isCorrectPosition = inclination < AppConfig.pouring.maximumCorrectInclination;

            let isCorrectPosition =
                (inclination >= AppConfig.pouring.inclination.correct.min &&
                inclination <= AppConfig.pouring.inclination.correct.max);

            neverCorrectPosition = neverCorrectPosition && !isCorrectPosition;
            return {
                inclination: inclination,
                isCorrectPosition: isCorrectPosition
            };
        });

        // just mark all as wrong position phase
        if (neverCorrectPosition) {
            newArray.forEach(function (elem) {
                elem.phase = PouringPhase.WRONG_POSITION;
            });
            return newArray;
        }

        for (let i = 0; i < newArray.length; ++i) {
            if (!newArray[i].phase && newArray[i].isCorrectPosition === false) {
                newArray[i].phase = PouringPhase.OPENING;
            } else {
                break;
            }
        }
        for (let i = newArray.length - 1; i >= 0; --i) {
            if (!newArray[i].phase && newArray[i].isCorrectPosition === false) {
                newArray[i].phase = PouringPhase.CLOSING;
            } else {
                break;
            }
        }
        for (let i = 0; i < newArray.length; ++i) {
            if (!newArray[i].phase) {
                if (newArray[i].isCorrectPosition === false) {
                    newArray[i].phase = PouringPhase.WRONG_POSITION;
                } else {
                    newArray[i].phase = PouringPhase.POURING;
                }
            }
        }
        return newArray;
    }

    public getStats (dataArray) :PourStats {

        let countPhase = (phase) => {
            return (pre, cur) => {
                return cur.phase === phase ? pre + 1 : pre;
            };
        };

        let openingTicks = dataArray.reduce( countPhase(PouringPhase.OPENING), 0 ),
            closingTicks = dataArray.reduce( countPhase(PouringPhase.CLOSING), 0 ),
            wrongPositionTicks = dataArray.reduce( countPhase(PouringPhase.WRONG_POSITION), 0 ),
            pouringTicks = dataArray.reduce( countPhase(PouringPhase.POURING), 0 );


        let totalTime = dataArray.length * AppConfig.pouring.tickFrequency,
            fullTime = AppConfig.pouring.tickFrequency,
            halfTime = AppConfig.pouring.tickFrequency / 2,
            quantityTime =
                (openingTicks * halfTime) +
                (closingTicks * halfTime) +
                (wrongPositionTicks * halfTime) +
                (pouringTicks * fullTime);


        let openingTime = openingTicks * AppConfig.pouring.tickFrequency,
            isGoodOpening = (openingTime <= AppConfig.pouring.ozQuarterDuration / 2),
            closingTime = closingTicks * AppConfig.pouring.tickFrequency,
            isGoodClosing = (closingTime <= AppConfig.pouring.ozQuarterDuration / 2),
            wrongPositionTime = wrongPositionTicks * AppConfig.pouring.tickFrequency;

        // bubble: if opening was fast enough
        if (isGoodOpening) {
            quantityTime -= AppConfig.pouring.bubbleDuration;
        }

        let quantity = quantityTime / AppConfig.pouring.ozQuarterDuration / 4;

       // let quantityIndex = Math.round(quantityTime / AppConfig.pouring.ozQuarterDuration);
        let quantityIndex = Math.max(0, Math.round(quantityTime / AppConfig.pouring.ozQuarterDuration) - 1);

        let measure = quantityIndex < Measure.list.length ? Measure.list[quantityIndex] : Measure.moreThan2oz;

        let stats = {
            data: dataArray,
            openingTime: openingTime,
            isGoodOpening: isGoodOpening,
            closingTime: closingTime,
            isGoodClosing: isGoodClosing,
            totalTime: quantityTime,
            quantity: quantity,
            measure: measure,
            bubbleHappened: isGoodOpening,
            wrongPositionTime: wrongPositionTime,
            isTotalWrongPosition: wrongPositionTicks === dataArray.length
        };

        return stats;
    }


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
                    let stats = this.getStats(this.calculateData(pourArray));
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