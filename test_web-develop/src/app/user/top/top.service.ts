import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/helpers/base.service';
import { Http } from '@angular/http';
import { StorageService } from 'src/app/shared/services/user/storageService';
@Injectable({ providedIn: 'root' })

export class TopService extends BaseService {
    constructor(
        protected http: Http,
        protected storage: StorageService
    ) {
        super(http);
    }

    scanQr(qrcode) {
        return this.getData(`conversation/${qrcode}/qr-code`, true);
    }
    joinGroup(qrcode) {
        return this.postData(`conversation/${qrcode}/join`, { type: 'group', user_id: this.storage.getUserInfo()['id'] }, null,  true);
    }

    register(body) {
        return this.postData('register/key', body);
    }
}