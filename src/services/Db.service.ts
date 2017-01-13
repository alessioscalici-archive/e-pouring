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

  public init() {
    this.db = sqlitePlugin.openDatabase('data.db');
    if (!this.db) {
      throw new Error('Impossible to init db');
    }

    this.executeSql('CREATE TABLE IF NOT EXISTS pour_test (date TEXT, measure INTEGER, pour TEXT)');

    // date works as sort of ID
    this.executeSql('CREATE TABLE IF NOT EXISTS pour_test (date TEXT, measure INTEGER, pour TEXT)');

  }

  public savePourTestSuite(suite: PourTestSuite) {

    if (!suite.isDone()) {
      throw new Error('Suite must be done to be saved');
    }
    let dateString = JSON.stringify(suite.date);

    let promiseArray = [];
    suite.testList.forEach((test) => {
      let promise = this.executeSql(
        'INSERT INTO pour_test (date, measure, pour) VALUES (?,?,?)',
        [dateString, test.measure.toJson(), test.stats.toJson()]
      );
      promiseArray.push(promise);
    });

    return Promise.all(promiseArray);
  }

  public queryPourTestSuites() {
    return this.executeSql('SELECT * FROM pour_test')
      .then((res) => {
        console.log('SELECT * FROM pour_test' , res);
      });
  }



  public getCreateSql(sqlData: SqlDetails) : string {
    let sql = 'CREATE TABLE ' + sqlData.table;
    let cols = [];

    for(var colName in sqlData.columns) {
      if (sqlData.columns.hasOwnProperty(colName)) {
        cols.push(colName + ' ' + sqlData.columns[colName]);
      }
    }
    sql += '(' + cols.join(', ') + ');';
    return sql;
  }

  public executeSql(query: string, params?: Object) : Promise<any> {
    console.log('executing: ' + query);
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this.db = sqlitePlugin.openDatabase('data.db');
        //return reject('Database is not open!');
      }
      this.db.transaction(function (txn) {
        txn.executeSql(query, params, function (tx, res) {
					console.log('executed: ' + query);
          return resolve(res);
        });
      });
    });
  }


}