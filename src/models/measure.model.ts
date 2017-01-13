
export class Measure {

	quantity: number;
	description: string;

    constructor(qt :number, desc :string) {
        this.quantity = qt;
        this.description = desc;
    }

    static list: Array<Measure> = [
        new Measure(0,    '< 1/4'),
        new Measure(0.25, '1/4'),
        new Measure(0.5,  '1/2'),
        new Measure(0.75, '3/4'),
        new Measure(1,    '1'),
        new Measure(1.25, '1 1/4'),
        new Measure(1.5,  '1 1/2'),
        new Measure(1.75, '1 3/4'),
        new Measure(2,    '2'),
        new Measure(2.5,  '> 2')
    ];

    static getExactoPourList(): Array<Measure> {
        return Measure.list.slice(1, 9);
    }

    static fromJson (index :number):Measure {
        return Measure.list[index];
    }

    toJson () :number {
        return Measure.list.indexOf(this);
    }
}