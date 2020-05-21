import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../helpers/base.service';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storageService';

@Injectable({ providedIn: 'root' })

export class UserService extends BaseService {
  loggedIn = new BehaviorSubject(false);
  _loggedIn = this.loggedIn.asObservable();
  profileChanged = new BehaviorSubject<object>({});
  // tslint:disable-next-line: deprecation
  constructor(public http: Http,
    public storage: StorageService
  ) {
    super(http);
    this.loggedIn.next(!!this.storage.getUserInfo());
    this.profileChanged.next(this.storage.getUserInfo());
  }
  doLogin(path, body) {
    return this.postData(path, body);
  }
  doLogout() {
    return this.postData('logout');
  }
  // USER

  login(value) {
    this.loggedIn.next(value);
  }

  getIsLoggedIn() {
    return this.loggedIn.getValue();
  }

  getUserInfo() {
    return this.storage.getUserInfo();
  }

  setUserInfo(data, type?) {
    if (type) {
      data['case_log'] = true;
    }
    this.storage.setUserInfo(data);
  }

  removeUserInfo() {
    this.storage.removeUserInfo();
    this.storage.removeLangTranslate();
  }

  register(body){
    return this.postData('/register', body);
  }
}
