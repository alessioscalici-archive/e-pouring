
import { SqlDetails } from './sql-data.model';

export class Measure {

	quantity: number;
	description: string;

	public static sqlData : SqlDetails = {
		table: 'measure',
		columns: {
			quantity: 'REAL',
			description: 'VARCHAR(5)'
		}
	};

	constructor(qt :number, desc :string) {
		this.quantity = qt;
		this.description = desc;
	}

	static moreThan2oz = new Measure(2.5, '> 2');

	static list: Array<Measure> = [
		new Measure(0.25, '1/4'),
		new Measure(0.5,  '1/2'),
		new Measure(0.75, '3/4'),
		new Measure(1,    '1'),
		new Measure(1.25, '1 1/4'),
		new Measure(1.5,  '1 1/2'),
		new Measure(1.75,  '1 3/4'),
		new Measure(2,    '2')
	];

}