import { Injectable } from '@angular/core';
// const AUTHEN_TOKEN = 'authen_token';
const USER_INFO = 'user_info';
const locale = 'locale';
const type_menu = 'type_menu';
const notification = 'notifications';
const locale_translate = 'translate';
@Injectable({providedIn: 'root'})
export class StorageService {

    constructor() { }

    getUserInfo() {
        const user = localStorage.getItem(USER_INFO);
        return JSON.parse(user);
    }

    setUserInfo(user) {
        user = (user && typeof user === 'object') ? JSON.stringify(user) : JSON.stringify({});
        return localStorage.setItem(USER_INFO, user);
    }

    removeUserInfo() {
        return localStorage.removeItem(USER_INFO);
    }

    setLang(lang) {
        return localStorage.setItem(locale, lang);
    }
    getLang() {
        return localStorage.getItem(locale);
    }

    setLangTranslate(lang) {
        return localStorage.setItem(locale_translate, lang);
    }
    getLangTranslate() {
        return localStorage.getItem(locale_translate);
    }


    getTypeMenu() {
        return localStorage.getItem(type_menu) || '1';
    }

    removeTypeMenu() {
        return localStorage.removeItem(type_menu);
    }
    setTypeMenu(type) {
        return localStorage.setItem(type_menu, type);
    }

    setNotification(arr) {
        return localStorage.setItem(notification, JSON.stringify(arr));
    }

    getNotification() {
        return JSON.parse(localStorage.getItem(notification));
    }

    removeNotification() {
        return localStorage.removeItem(notification);
    }

    removeLangTranslate() {
        return localStorage.removeItem(locale_translate);
    }
}
