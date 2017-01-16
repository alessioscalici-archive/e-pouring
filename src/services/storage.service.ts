import { groupBy, forEach } from 'lodash';
import { PourTestSuite } from '../models/pour-test-suite.model';
import { Db } from './Db.service';


export class StorageService {

	private db;

	constructor() {
		this.db = new Db();
	}

	init() {
		let queries = [
			'CREATE TABLE IF NOT EXISTS pour_test (date TEXT, measure INTEGER, pour TEXT)'
		];
		let promises = queries.map((query) => {
			return this.db.executeSql(query);
		});
		return Promise.all(promises);
	}

	clear() {
		let queries = [
			'DROP table pour_test'
		];
		let promises = queries.map((query) => {
			return this.db.executeSql(query);
		});
		return Promise.all(promises);
	}

	getPourTests():Promise<Array<PourTestSuite>> {
		return this.db.executeSql('SELECT * FROM pour_test')
			.then((res) => {

				var array = [];
				for (let i=0; i<res.rows.length; ++i) {
					array.push(res.rows.item(i));
				}
				var grouped = groupBy(res.rows, 'date');
				let testSuites = [];
				forEach(grouped, (v, k) => {
					let suiteJson = {
						date: k,
						testList: []
					};
					forEach(v, (testRow) => {
						suiteJson.testList.push(testRow);
					});
					testSuites.push(suiteJson);
				});

				return testSuites.map(PourTestSuite.fromJson);
			});
	}


	addPourTest(suite:PourTestSuite):Promise<any> {
		if (!suite.isDone()) {
			throw new Error('Suite must be done to be saved');
		}
		let dateString = JSON.stringify(suite.date);

		let valuesArray = [];
		suite.testList.forEach((test) => {
				valuesArray.push('(\'' + dateString + '\', ' + test.measure.toJson() + ',\'' + JSON.stringify(test.stats.toJson()).replace(/"/g, '') + '\')');
		});

		return this.db.executeSql(
			'INSERT INTO pour_test (date, measure, pour) VALUES ' + valuesArray.join(',')
		);
	}
}