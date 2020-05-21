import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from 'src/app/shared/services/helpers/base.service';
import { Http } from '@angular/http';
@Injectable({ providedIn: 'root' })

export class HomeService extends BaseService {
  s_delete = new BehaviorSubject(false);
  $s_delete = this.s_delete.asObservable();

  s_block = new BehaviorSubject(false);
  $s_block = this.s_block.asObservable();

  s_edit = new BehaviorSubject(false);
  $s_edit = this.s_edit.asObservable();

  s_delete_message = new BehaviorSubject(false);
  $s_delete_message = this.s_delete_message.asObservable();

  s_showdetail = new BehaviorSubject(false);
  $s_showdetail = this.s_showdetail.asObservable();
  constructor(
    protected http: Http
  ) {
    super(http);
  }

  nextDelete(value) {
    this.s_delete.next(value);
  }

  nextBlock(value) {
    this.s_block.next(value);
  }

  nextEdit(value) {
    this.s_edit.next(value);
  }

  nextDeleteMessage(value) {
    this.s_delete_message.next(value);
  }

  nextDetail(value) {
    this.s_showdetail.next(value);
  }

  getConversations() {
    return this.getData('conversation/list', true);
  }

  getMemberConversation(idconversation) {
    return this.getData(`conversation/${idconversation}/member`, true);
  }

  getMessageConversation(idconversation) {
    return this.getData(`conversation/${idconversation}/messages`, true);
  }

  deleteConvesation(body) {
    return this.delete('conversation/delete', body, true);
  }

  updateConvesation(body) {
    return this.putData('conversation/update', body, null, true);
  }

  deleteMessageOwner(body){
    return this.delete('conversation/message/delete', body, true);
  }

  editRole(body) {
    return this.putData('user/edit-role', body);
  }
}
