
import { Measure } from './measure.model';
import { PourStats } from './pour-stats.model';


export class PourTest {

    // the expected measure
    measure: Measure;
    stats: PourStats;


    constructor(measure: Measure) {

        if (!measure) {
            throw new Error('PourTest: measure must be populated');
        }

        this.measure = measure;
    }


    /**
     *
     * @returns {number} the accuracy in a range from 0 to 1
     */
    getAccuracy() : number {

        if (this.measure && this.stats) {
            var n = 0.125 - Math.abs(this.stats.quantity - this.measure.quantity);
            n = Math.max(n, 0);
            return n / 0.125;
        }

        throw new Error('PourTest.prototype.getAccuracy() not available');
    }

    isDone() : boolean {
        return !!this.stats;
    }

    isCorrect() : boolean {
        return (this.stats.measure === this.measure);
    }

}