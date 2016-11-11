import {Component, Input, SimpleChanges} from '@angular/core';
import {List, Item} from 'ionic/ionic';
import { PourStats } from '../../models/pour-stats.model';

@Component({
    selector: 'pour-report-text',
    templateUrl: 'pour-report-text.html'
})
export class PourReportText {

    @Input() stats: PourStats;


    constructor() {


    }

    ngOnChanges(changes: SimpleChanges) {
        //alert('ciao');
    }
}