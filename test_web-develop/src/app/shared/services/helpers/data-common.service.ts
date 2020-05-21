import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx'
import * as _ from 'lodash';
// import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';

@Injectable()
export class DataCommonService  {

  // private countries = [];

  // constructor(public http: Http) {
  //   super(http)
  //   this.initData();
  // }

  // getData(path) {
  //   return this.http.get('assets/datas/' + path + '.json')
  //     .map((res: Response) => res.json())
  //     .catch((err) => {
  //       return Observable.throw(err);
  //     });;
  // }

  // initData() {
  //   this.getData('countries').subscribe((result) => {
  //     this.countries = result;
  //   })
  // }

  // getCountries() {
  //   return this.getData('countries');
  // }

  // createDateSelect(name_type, content) {
  //   let data = [];
  //   for (let index = 0; index < name_type.length; index++) {
  //     let object = { id: index, sortname: name_type[index], itemName: content[index] };
  //     data.push(object);
  //   }
  //   return data;
  // }

}
