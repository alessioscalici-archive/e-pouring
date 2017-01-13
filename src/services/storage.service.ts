

import { PourTestSuite } from '../models/pour-test-suite.model';


export class StorageService {


    getPourTests() : Array<PourTestSuite> {
        let str = window.localStorage.getItem('PourTests');
        let json = JSON.parse(str);
        if (!Array.isArray(json)) {
            return [];
        }
        let res = [];
        for (let i=0; i<json.length; ++i) {
            res.push(PourTestSuite.fromJson(json[i]));
        }
        return res;
    }



    addPourTest(testSuite :PourTestSuite) : Array<PourTestSuite> {

        var arr = this.getPourTests();
        arr.push(testSuite);
        var jsonArr = arr.map((test) => {
            return test.toJson();
        });
        window.localStorage.setItem('PourTests', JSON.stringify(jsonArr));
        return arr;
    }
}