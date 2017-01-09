import { Injectable } from '@angular/core';

import { SqlDetails } from '../models/sql-data.model';
import { Measure } from '../models/measure.model';

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

    this.executeSql(this.getCreateSql(Measure.sqlData), {});

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
        return reject('Database is not open!');
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