

import { PourTest } from './pour-test.model';
import { Measure } from './measure.model';

export class PourTestSuite {

    // the expected measure
    date: Date;
    testList: Array<PourTest>;


    constructor() {

        this.date = new Date();
        let list = Measure.getExactoPourList();
        this.testList = [
            new PourTest(list[4]),
            new PourTest(list[1]),
            new PourTest(list[2]),
            new PourTest(list[5]),
            new PourTest(list[3]),
            new PourTest(list[0]),
            new PourTest(list[7])
        ];
    }



    isDone() : boolean {
        for (let i=0; i<this.testList.length; ++i) {
            if (!this.testList[i].isDone()) {
                return false;
            }
        }
        return true;
    }

    toJson(): Object {
        let obj = {
            date: JSON.stringify(this.date),
            testList: []
        };
        for (let i=0; i<this.testList.length; ++i) {
            obj.testList.push(this.testList[i].toJson());
        }
        return obj;
    }

    static fromJson(json) : PourTestSuite {
        let res = new PourTestSuite();
        res.date = new Date(JSON.parse(json.date));
        res.testList = PourTest.arrayFromJson(json.testList);
        return res;
    }
}