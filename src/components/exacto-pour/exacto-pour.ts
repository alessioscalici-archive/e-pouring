import {Component, Input} from '@angular/core';
import {List, Item} from 'ionic/ionic';

@Component({
    selector: 'exacto-pour',
    templateUrl: 'exacto-pour.html'
})
export class ExactoPour {

    @Input() quantity: number;

    measures: Array<string>;

    constructor() {

        this.measures = ['1/4', '1/2', '3/4', '1', '1 1/4', '1 1/2', '1 3/4', '2'].reverse();
    }

    getPercent() {
        return this.quantity / 2 * 100;
    }
}