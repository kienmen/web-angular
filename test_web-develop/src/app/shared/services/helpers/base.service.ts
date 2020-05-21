import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import { environment as config } from '../../../../environments/environment';
import * as _ from 'lodash';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StorageService } from '../user/storageService';
@Injectable()
export class BaseService {

    OBJECT_ERROR = { 'code': 400, 'message': 'Please check your internet connection and try again' };

    constructor(protected http: Http, protected storage?: StorageService) { }

    private getUrlApi(type?) {
        return type ? config.hostConversation : config.host;
    }

    protected getData(path: string, type?): Observable<any> {
        let options = this.getHeaders();
        return this.http.get(`${this.getUrlApi(type)}/${path}`, options)
            .pipe(
                map(res => {
                    return res.json();
                }),
                catchError(err => this.getError(err))
            );
    }

    protected postData(path: string, body?: any, headersPairs?: any, type?): Observable<any> {
        let options = this.getHeaders(headersPairs);
        return this.http.post(`${this.getUrlApi(type)}/${path}`, body, options)
            .pipe(
                map(res => {
                    return res.json();
                }),
                catchError(err => this.getError(err))
            );
    }


    protected delete(path, headersPairs?: any, type?) {
        let options =  this.getHeaders(headersPairs);
        return this.http.delete(`${this.getUrlApi(type)}/${path}`, options)
            .pipe(
                map(res => {
                    return res.json();
                }),
                catchError(err => this.getError(err))
            );
    }

    protected putData(path, body, headersPairs?: any, type?) {
        let options =  this.getHeaders(headersPairs);
        return this.http.put(`${this.getUrlApi(type)}/${path}`,  body, options)
            .pipe(
                map(res => {
                    return res.json();
                }),
                catchError(err => this.getError(err))
            );
    }

    getError(err) {
        if (!err.json().message) {
            return throwError(this.OBJECT_ERROR);
        }
        return throwError(err.json());
    }

    private getHeaders(headersPairs?: any) {
        const headers = new Headers();
        if (localStorage.getItem('user_info')) {
            headers.append('token', JSON.parse(localStorage.getItem('user_info'))['token']);
            headers.append('api_key', config.apiKeyChat);
        }
        headers.append('locale', localStorage.getItem('locale') || 'ja');
        headers.append('Content-Type', 'application/json');
        // if (headersPairs) {
        //     _.forEach(headersPairs, (value, key) => {
        //         headers.append(key, value);
        //     });
        // }
        return new RequestOptions({ headers, body : headersPairs });

    }

    translateGoogleAPI(text, default_lang, translate_lang) {
        return this.http.get(`${config.google_API}/?q=${text}&source=${default_lang}&target=${translate_lang}&key=${config.google_API_KEY}`)
        .pipe(
            map(res => {
                return res.json();
            }),
            catchError(err => this.getError(err))
        );
    }
}
