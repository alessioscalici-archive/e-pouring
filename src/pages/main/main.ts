import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { Locale, LocalizationService } from 'angular2localization';

import { Db } from '../../services/Db.service';

@Component({
  selector: 'main-page',
  templateUrl: 'main.html'
})
export class MainPage extends Locale {
  constructor(
      public localization: LocalizationService,
			public platform: Platform,
			public db: Db
  ) {
    super(null, localization);

		platform.ready().then(() => {


				db.executeSql('insert into measure values (1.25, "1 1/4")')
				.then(() => {
						return db.executeSql('select * from measure')
					}).then((data) => {
						alert(data.rows.item(0).description)
					});

		});

  }
}
