import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { UserService } from 'src/app/shared/services/user/user.service';

@Injectable()
export class SocketService {
  public socket;

  constructor(private userService: UserService) {
  }

  connect() {
    this.socket = io(environment.hostConversation);
    this.socket.on('connect', () => {
      this.socket.emit('authentication', {
        sender_id: this.userService.getUserInfo()['id'],
        access_token: this.userService.getUserInfo()['token']
      });
    });
  }

  authetication() {
    return Observable.create(observer => {
      this.socket.on('authenticated', msg => {
        observer.next(msg);
      });
    });
  }

  listenMessage(id) {
    this.socket.emit('chain:join', { conversation_id: id });
    return Observable.create(observer => {
      this.socket.on('message:new', (msg) => {
        observer.next(msg);
      });
    });
  }

  listenListGroups() {
    this.socket.emit('list:join', { user_id: this.userService.getUserInfo()['id'] });
    return Observable.create(observer => {
      this.socket.on('list:new', (msg) => {
        observer.next(msg);
      });
    });
  }

  turnOffNotification(id) {
    this.socket.emit('chain:seen', {
      conversation_id: id,
      user_id: this.userService.getUserInfo()['id']
    });
  }

  setMessage(body) {
    this.socket.emit('message:sent', body);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
