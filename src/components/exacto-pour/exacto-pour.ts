import {Component, Input} from '@angular/core';
import {List, Item} from 'ionic/ionic';

import { Measure } from '../../models/measure.model';

@Component({
    selector: 'exacto-pour',
    templateUrl: 'exacto-pour.html'
})
export class ExactoPour {

    @Input() quantity: number;

    measures: Array<Measure>;

    constructor() {

        this.measures = Measure.list.slice().reverse();
    }

    getPercent() {
        return this.quantity / 2 * 100;
    }
}