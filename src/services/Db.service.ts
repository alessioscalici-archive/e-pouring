import { Injectable } from '@angular/core';

import { SqlDetails } from '../models/sql-data.model';
import { Measure } from '../models/measure.model';
import { PourTestSuite } from '../models/pour-test-suite.model';

declare var sqlitePlugin;

@Injectable()
export class Db {

  private db;
  constructor() {

  }


  public executeSql(query: string, params?: Object) : Promise<any> {
    console.log('executing: ' + query);
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this.db = sqlitePlugin.openDatabase('data.db');
      }
      this.db.transaction(function (txn) {
        txn.executeSql(query, params, function (tx, res) {
					console.log('executed: ' + query);
          return resolve(res);
        }, function (tx, res) {
          console.log('error: ' + query, tx, res);
          return reject(res);
        });
      });
    });
  }


}