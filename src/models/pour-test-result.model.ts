
import { Measure } from './measure.model';
import { PourStats } from './pour-stats.model';


export class PourTestResult {

    // the expected measure
    measure: Measure;
    stats: PourStats;

    constructor(measure: Measure, stats: PourStats) {

        if (!measure || !stats) {
            throw new Error('PourTestResult constructor: arguments are mandatory');
        }
        this.measure = measure;
        this.stats = stats;
    }


    getAccuracy() {

        if (this.measure && this.stats) {
            var n = 0.125 - Math.abs(this.stats.quantity - this.measure.quantity);
            n = Math.max(n, 0);
            return n / 0.125 * 100;
        }

        throw new Error('PourTestResult.prototype.getAccuracy() not available');
    }


}