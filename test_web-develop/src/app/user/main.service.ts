import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from 'src/app/shared/services/helpers/base.service';
import { Http } from '@angular/http';
@Injectable()

export class MainService extends BaseService {
  constructor(
    protected http: Http
  ) {
    super(http);
  }

  getListConversation() {
    return this.getData('conversation/user', true);
  }

  getListMember(qrcode) {
    return this.getData(`conversation/${qrcode}/user`, true);
  }

  getMessage(conversationid, offset, limit) {
    return this.getData(`conversation/${conversationid}/messages?offset=${offset}&limit=${limit}`, true);
  }

  createConverSation(body) {
    return this.postData('conversation', body, null, true);
  }

  joinConveSation(body, conversation_id) {
    return this.postData(`conversation/${conversation_id}/join`, body, null, true);
  }

  checkAvaliableConversation(memberId, yourId, qrcode) {
    return this.getData(`conversation/single?user_one=${memberId}&user_two=${yourId}&qr_code=${qrcode}`, true);
  }

  translateGoogle(text, default_lang, translate_lang) {
    return this.translateGoogleAPI(text, default_lang, translate_lang);
  }
}
