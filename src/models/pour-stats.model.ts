import { Measure } from './measure.model';

import { AppConfig } from '../app/app-config.service';


enum PouringPhase {
    OPENING = 1,
    CLOSING,
    WRONG_POSITION,
    POURING
}

export class PourTick {
    inclination :number;
    isCorrectPosition :boolean;
}

export class PourStats {

    data :Array<PourTick>;
    openingTime :number;
    isGoodOpening :boolean;
    closingTime :number;
    isGoodClosing :boolean;
    totalTime :number;
    quantity :number;
    measure :Measure;
    bubbleHappened :boolean;
    wrongPositionTime :number;
    isTotalWrongPosition :boolean;


    constructor(dataObj : Array<number> | string ) {
        let numArray;
        if (Array.isArray(dataObj)) {
            numArray = dataObj;
        } else {
            numArray = dataObj.split('|').map(function(str) {
                return parseFloat(str);
            });
        }
        let dataArray = this.calculateData(numArray);
        this.setStats(dataArray);
    }


    toJson() :string {
        let arr = this.data.map(function(pourTick) {
            return pourTick.inclination + '';
        });
        return arr.join('|');
    }

    static fromJson(pourString :string) :PourStats {
        return new PourStats(pourString);
    }


    private calculateData (baseArray) :Array<any> {
        let neverCorrectPosition = true;
        let newArray =  baseArray.map(function (inclination) {

            let isCorrectPosition =
              (inclination >= AppConfig.pouring.inclination.correct.min &&
              inclination <= AppConfig.pouring.inclination.correct.max);

            neverCorrectPosition = neverCorrectPosition && !isCorrectPosition;
            return {
                inclination: Math.round(inclination * 10000)/10000,
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

    private setStats (dataArray) :void {

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
        let quantityIndex = Math.max(0, Math.round(quantityTime / AppConfig.pouring.ozQuarterDuration));

        if (quantityIndex >= Measure.list.length) {
            quantityIndex = Measure.list.length - 1;
        }
        let measure = Measure.list[quantityIndex];

        this.data = dataArray;
        this.openingTime = openingTime;
        this.isGoodOpening = isGoodOpening;
        this.closingTime = closingTime;
        this.isGoodClosing = isGoodClosing;
        this.totalTime = quantityTime;
        this.quantity = quantity;
        this.measure = measure;
        this.bubbleHappened = isGoodOpening;
        this.wrongPositionTime = wrongPositionTime;
        this.isTotalWrongPosition = wrongPositionTicks === dataArray.length;
    }

}