
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

    toJson(): Object {
        let obj = {
            measure: this.measure.toJson(),
            stats: this.stats ? this.stats.toJson() : null
        };
        return obj;
    }

    static fromJson(json) : PourTest {
        let measure = Measure.fromJson(json.measure);
        let instance = new PourTest(measure);
        instance.stats = PourStats.fromJson(json.stats);
        return instance;
    }

    static arrayFromJson(json) : Array<PourTest> {
        return json.map(PourTest.fromJson);
    }

}