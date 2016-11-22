import {Component, Input} from '@angular/core';
import {List, Item} from 'ionic/ionic';

import { Locale, LocalizationService } from 'angular2localization';

import { PourTest } from '../../models/pour-test.model';

@Component({
    selector: 'pour-report',
    templateUrl: 'pour-report.html'
})
export class PourReport extends Locale {

    @Input() test: PourTest;


    constructor(
        public localization: LocalizationService
    ) {
        super(null, localization);

    }


}