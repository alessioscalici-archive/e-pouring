import { Injectable } from '@angular/core';
import { DeviceMotion } from 'ionic-native';
import { Subscription } from 'rxjs/Subscription';
import { AccelerationData } from 'ionic-native';

import { PourStats } from '../../models/pour-stats.model';


enum PouringPhase {
    OPENING = 1,
    CLOSING,
    WRONG_POSITION,
    POURING
}

/**
 * FIXME move it in a config object
 */
let freePouringConfig = {
    tickFrequency: 50,
    bubbleDuration: 50,
    ozQuarterDuration: 350,
    maximumCorrectInclination: -6.5
};

@Injectable()
export class FreePouringService {

    private subscription: Subscription;
    private isSubscribed: boolean;


    public calculateData (baseArray) :Array<any> {
        let neverCorrectPosition = true;
        let newArray =  baseArray.map(function (inclination) {
            let isCorrectPosition = inclination < freePouringConfig.maximumCorrectInclination;
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


        let totalTime = dataArray.length * freePouringConfig.tickFrequency,
            fullTime = freePouringConfig.tickFrequency,
            halfTime = freePouringConfig.tickFrequency / 2,
            quantityTime =
                (openingTicks * halfTime) +
                (closingTicks * halfTime) +
                (wrongPositionTicks * halfTime) +
                (pouringTicks * fullTime);


        let openingTime = openingTicks * freePouringConfig.tickFrequency,
            isGoodOpening = (openingTime <= freePouringConfig.ozQuarterDuration / 2),
            closingTime = closingTicks * freePouringConfig.tickFrequency,
            isGoodClosing = (closingTime <= freePouringConfig.ozQuarterDuration / 2),
            wrongPositionTime = wrongPositionTicks * freePouringConfig.tickFrequency;

        // bubble: if opening was fast enough
        if (isGoodOpening) {
            quantityTime -= freePouringConfig.bubbleDuration;
        }

        let quantity = quantityTime / freePouringConfig.ozQuarterDuration / 4;

       // let quantityIndex = Math.round(quantityTime / freePouringConfig.ozQuarterDuration);
        let quantityIndex = Math.max(0, Math.round(quantityTime / freePouringConfig.ozQuarterDuration) - 1);

        let quantityLabels = ['1/4', '1/2', '3/4', '1', '1 1/4', '1 1/2', '1 3/4', '2'];
        let quantityText = quantityIndex < quantityLabels.length ? quantityLabels[quantityIndex] : '> 2 oz';

        let stats = {
            data: dataArray,
            openingTime: openingTime,
            isGoodOpening: isGoodOpening,
            closingTime: closingTime,
            isGoodClosing: isGoodClosing,
            totalTime: quantityTime,
            quantity: quantity,
            quantityText: quantityText,
            bubbleHappened: isGoodOpening,
            wrongPositionTime: wrongPositionTime,
            isTotalWrongPosition: wrongPositionTicks === dataArray.length
        };

        return stats;
    }


    public toggleAccelerometer (callback) :boolean {

        if (this.isSubscribed) {
            this.isSubscribed = false;
            this.subscription.unsubscribe();
            return false;
        }
        this.isSubscribed = true;

        let pouring = false;

        let pourArray = [];


        this.subscription = DeviceMotion.watchAcceleration({frequency: freePouringConfig.tickFrequency})
            .subscribe((acceleration:AccelerationData) => {

                if (acceleration.y < 0) {
                    if (!pouring) {
                        pouring = true;
                    }

                    pourArray.push(acceleration.y);

                } else if (pouring && acceleration.y >= 0) {
                    pouring = false;
                    let stats = this.getStats(this.calculateData(pourArray));
                    pourArray = [];
                    callback(stats);
                }
            });
        return true;

    }


}