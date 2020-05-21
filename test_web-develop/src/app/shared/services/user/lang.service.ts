import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { StorageService } from './storageService';

@Injectable({providedIn: 'root'})
export class LangService {
    // lang
    public _lang = new BehaviorSubject('ja');
    public lang$ = this._lang.asObservable();

    public _langtranslate = new BehaviorSubject('ja');
    public _langtranslate$ = this._langtranslate.asObservable();

    constructor(private storage: StorageService) {
        this._lang.next(this.storage.getLang() || 'ja');
        this._langtranslate.next(this.storage.getLangTranslate() || 'ja');

     }

    toogleLang(value: string) {
        this.storage.setLang(value);
        return this._lang.next(value);
    }

    toogleLangTranslate(value: string) {
        this.storage.setLangTranslate(value);
        return this._langtranslate.next(value);
    }
}
