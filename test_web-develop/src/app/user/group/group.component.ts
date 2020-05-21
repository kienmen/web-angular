import { Component, OnInit } from '@angular/core';
import { ComponentActions } from 'src/app/shared/components/alert/component-actions';
import { MainService } from '../main.service';
import { TimeService } from 'src/app/shared/services/helpers/time.service';
import { SocketService } from '../top/socket.service';
import { LangService } from 'src/app/shared/services/user/lang.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/shared/enums/utils';
import { CrudType } from 'src/app/shared/enums/crud-type.enum';
import { Limit, TypeMessage } from 'src/app/shared/enums/limit.enum';
import { UserService } from 'src/app/shared/services/user/user.service';
declare var $: any;
import { UUID } from 'angular2-uuid';
const STATUS = 0;
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  data = {
    groups: [],
    messages: [],
    members: [],
    lang: 'ja',
    messages_translate: {
      ja: [],
      en: []
    },
    offset_mess: 0,
    client_height: 999999,
    accept_chat: false
  };

  data_blind = {
    id_converstation: '',
    id_converstation_group_current: '',
    id_converstation_member_current: '',
    qr_code_group: '',
    id_user: '',
    id_owner: '',
    id_group_name: ''
  };

  message = {
    title: '',
    message: '',
    mode: 0
  };
  case_log;
  constructor(
    private componentAction: ComponentActions,
    private mainService: MainService,
    private timeService: TimeService,
    private socketService: SocketService,
    private langservice: LangService,
    private activeRouted: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.case_log = this.userService.getUserInfo()['case_log'];
  }

  ngOnInit() {
    this.langservice._langtranslate$.subscribe(
      res => {
        this.data.lang = res;
      }
    );
  }

  async ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    await this.initData();
    this.activeRouted.queryParams.subscribe(
      params => {
        // conversation_id
        if (params.conversation_id) {
          // not conversation_id current
          this.data_blind.id_converstation_group_current = params.conversation_id;
          this.data_blind.id_converstation_member_current = params.member;
          this.data_blind.qr_code_group = params.code;
          this.data_blind.id_user = params.user;
          let obj;
          this.data.groups.filter(function (o) {
            o['conversation_id'] === params.conversation_id ? o['active'] = true : o['active'] = false;
            o['conversation_id'] === params.conversation_id ? obj = o : {};
          });
          this.handleGroup(obj, this.data_blind.id_converstation_member_current);
        } else {
          if (this.data.groups.length > 0) {
            this.router.navigate(['/dashboard'],
              { queryParams: { conversation_id: this.data.groups[0]['conversation_id'], code: this.data.groups[0]['qr_code'] } })
          }
        }
      }
    );
  }

  initData() {
    return new Promise((resolve, reject) => {
      this.data.groups = [];
      this.mainService.getListConversation().subscribe(
        res => {
          let index = 0;
          res.forEach(element => {
            let obj = {
              no: index++,
              conversation_id: element['id'],
              id_owner: element['user']['id'],
              qr_code: element['qr_code'],
              count: element['total_member'] || '0',
              name: element['title'],
              active: false,
              notifications: element['total_notification'],
              updated_at: element['message']['createdAt'] ? element['message']['createdAt'] : element['create_at'],
              updated: element['message']['createdAt'] ?
                this.timeService.getTimeFormatFromDate(element['message']['createdAt'], this.timeService.LAST_HOUR_MINUTES) :
                this.timeService.getTimeFormatFromDate(element['create_at'], this.timeService.LAST_HOUR_MINUTES)
              , current_notifications: element['total_notification']
            };
            this.data.groups.push(obj);
          });
          this.data.groups.sort(function (a, b) {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          });
          resolve([]);
        },
        err => {
          resolve([]);
        }
      );
    });
  }
  // navigate current group
  chooseGroup(item) {
    this.router.navigate(['/dashboard'], { queryParams: { conversation_id: item['conversation_id'], code: item['qr_code'] } });
  }
  // handle group
  handleGroup(item, conversation_member?) {
    if (this.socketService.socket) {
      this.socketService.disconnect();
    }
    this.socketService.connect();
    this.data_blind.id_converstation = item['conversation_id'];
    this.data_blind.id_owner = item['id_owner'];
    this.data_blind.id_group_name = item['name'];
    this.data.members = [];
    this.data.messages = [];
    this.data.messages_translate[Utils.JA] = [];
    this.data.messages_translate[Utils.EN] = [];
    this.getMembers(item, conversation_member);
    this.listen(item);
  }
  // socket group
  listen(item) {
    // turnoff notification
    // authentication
    this.socketService.authetication().subscribe(
      authe => {
        // new message in current group
        this.socketService.listenMessage(item['conversation_id']).subscribe(
          res_message => {
            if (res_message['status'] == STATUS) {
              let object_default = {
                createdAt: res_message['createdAt'],
                message_type: res_message['message_type'],
                message: res_message['message'],
                type_message: this.userService.getUserInfo()['id'] === res_message['sender_id'] ? TypeMessage.SENT : TypeMessage.RECEVEI
              };
              // translate
              let object_translate = {
                createdAt: res_message['createdAt'],
                message_type: res_message['message_type'],
                message: res_message['message_type'] === 'text' ? res_message['translate_message'] : res_message['message'],
                type_message: this.userService.getUserInfo()['id'] === res_message['sender_id'] ? TypeMessage.SENT : TypeMessage.RECEVEI
              };
              // check
              if (this.data.lang === res_message['lang'] && res_message['lang'] === Utils.JA) {
                this.data.messages_translate[Utils.JA].push(object_default);
                this.data.messages_translate[Utils.EN].push(object_translate);
              }
              if (this.data.lang === res_message['lang'] && res_message['lang'] === Utils.EN) {
                this.data.messages_translate[Utils.EN].push(object_default);
                this.data.messages_translate[Utils.JA].push(object_translate);
              }
              if (this.data.lang !== res_message['lang'] && res_message['lang'] === Utils.EN && this.data.lang === Utils.JA) {
                this.data.messages_translate[Utils.EN].push(object_default);
                this.data.messages_translate[Utils.JA].push(object_translate);
              }
              if (this.data.lang !== res_message['lang'] && res_message['lang'] === Utils.JA && this.data.lang === Utils.EN) {
                this.data.messages_translate[Utils.JA].push(object_default);
                this.data.messages_translate[Utils.EN].push(object_translate);
              }
              this.scrollBottom();
            }
          }
        );
        //  new message another list
        this.socketService.listenListGroups().subscribe(
          res_list => {
            if (res_list['message']['status'] == STATUS) {
              // out
              if (!this.data_blind.id_converstation_member_current &&
                res_list['qr_code'] !== this.data_blind.qr_code_group
              ) {
                for (let index = 0; index < this.data.groups.length; index++) {
                  if (this.data.groups[index]['qr_code'] === res_list['qr_code']) {
                    this.data.groups[index]['notifications'] += res_list['total'];
                    this.data.groups[index]['updated'] =
                      this.timeService.getTimeFormatFromDate(res_list['message']['createdAt'], this.timeService.LAST_HOUR_MINUTES);
                    // if (index !== 0) {
                    this.data.groups.splice(0, 0, this.data.groups[index]);
                    this.data.groups.splice(index + 1, 1);
                    // }
                    break;
                  }
                }
              }
              // not out
              if (this.data_blind.qr_code_group === res_list['qr_code']) {
                // listen another
                if (this.data_blind.id_converstation_member_current) {
                  // curent
                  if (res_list['message']['conversation_id'] === this.data_blind.id_converstation_member_current) {
                    this.socketService.turnOffNotification(item['conversation_id']);
                  } else {
                    // another
                    for (let index = 0; index < this.data.groups.length; index++) {
                      if (this.data.groups[index]['qr_code'] === res_list['qr_code']) {
                        this.data.groups[index]['notifications'] += res_list['total'];
                        this.data.groups[index]['updated'] =
                          this.timeService.getTimeFormatFromDate(res_list['message']['createdAt'], this.timeService.LAST_HOUR_MINUTES);
                        break;
                      }
                    }
                  }
                }
                // current
                if (!this.data_blind.id_converstation_member_current) {
                  let obj = this.data.members.find(function (o) {
                    return o['id_user'] === res_list['message']['sender_id'];
                  });
                  if (obj) {
                    for (let index = 0; index < this.data.members.length; index++) {
                      if (this.data.members[index]['conversation_id'] === res_list['message']['conversation_id']) {
                        this.data.members[index]['notifications'] += res_list['total'];
                        this.data.members[index]['updated'] =
                          this.timeService.getTimeFormatFromDate(res_list['message']['createdAt'], this.timeService.LAST_HOUR_MINUTES);
                        for (let second = 0; second < this.data.groups.length; second++) {
                          if (this.data.groups[second]['qr_code'] === res_list['qr_code']) {
                            this.data.groups[second]['notifications'] += res_list['total'];
                            this.data.groups[second]['updated'] =
                              this.timeService.getTimeFormatFromDate(res_list['message']['createdAt'], this.timeService.LAST_HOUR_MINUTES);
                            break;
                          }
                        }
                        break;
                      }
                    }
                  } else {
                    let obj_group = this.data.groups.find(function (o) {
                      return o['qr_code'] === res_list['qr_code'];
                    });
                    if (obj_group) {
                      obj_group['count'] += 1;
                      this.handleGroup(obj_group, null);
                    }
                    this.socketService.turnOffNotification(this.data_blind.id_converstation_group_current);
                  }
                }
              }
            }
          }
        );
      }
    );
  }
  // handle member group
  async getMembers(item, conversation_member) {
    this.componentAction.showLoading();
    let data_members = [];
    let data_member_check = [];
    let data_member_after_check = [];
    // await get member
    await this.getMemberOfGroup(item)
      .then(
        data => {
          data_members = data['member'];
          data_member_check = data['others'];
        }
      )
      .catch(err => {
        this.showPopUp(Utils.TITLE_ERROR, err.message, CrudType.CANCEL);
        this.componentAction.hideLoading();
      });

    for (let index = 0; index < data_member_check.length; index++) {
      // check others chat
      if (this.data_blind.id_user === data_member_check[index]['user']['id']) {
        await this.checkAvaliableConversation(this.userService.getUserInfo()['id'], data_member_check[index]['user']['id'], item['qr_code'])
          .then(
            data_check => {
              if (data_check['created'] === true) {
                let obj = {
                  owner: data_member_check[index]['user']['id'] === item['id_owner'] ? true : false,
                  id_owner: item['id_owner'],
                  nickname: data_member_check[index]['user']['id'],
                  id_user: data_member_check[index]['user']['id'],
                  profile: data_member_check[index]['user']['url_avatar'],
                  name: data_member_check[index]['user']['nick_name'],
                  active: false,
                  user_name: data_member_check[index]['user']['id'],
                  email: data_member_check[index]['user']['email'],
                  fullname: data_member_check[index]['user']['first_name'] + data_member_check[index]['user']['last_name'],
                  phone_number: data_member_check[index]['user']['phone'],
                  smile: data_member_check[index]['user']['nick_name'],
                  old: data_member_check[index]['user']['age'],
                  gender: data_member_check[index]['user']['gender'],
                  lang: data_member_check[index]['user']['language_id'],
                  index: 0,
                  conversation_id: data_check['conver']['id'],
                  qr_code: data_check['conver']['qr_code'] || this.data_blind.qr_code_group,
                  notifications: 0,
                  updated: this.timeService.getTimeFormatFromDate(data_check['conver']['createdAt'], this.timeService.LAST_HOUR_MINUTES)
                };
                data_member_after_check.push(obj);
              } else {
                let obj = {
                  owner: data_member_check[index]['user']['id'] === item['id_owner'] ? true : false,
                  id_owner: item['id_owner'],
                  nickname: data_member_check[index]['user']['id'],
                  id_user: data_member_check[index]['user']['id'],
                  profile: data_member_check[index]['user']['url_avatar'],
                  name: data_member_check[index]['user']['nick_name'],
                  active: false,
                  user_name: data_member_check[index]['user']['id'],
                  email: data_member_check[index]['user']['email'],
                  fullname: data_member_check[index]['user']['first_name'] + data_member_check[index]['user']['last_name'],
                  phone_number: data_member_check[index]['user']['phone'],
                  smile: data_member_check[index]['user']['nick_name'],
                  old: data_member_check[index]['user']['age'],
                  gender: data_member_check[index]['user']['gender'],
                  lang: data_member_check[index]['user']['language_id'],
                  index: 0,
                  conversation_id: undefined,
                  qr_code: this.data_blind.qr_code_group,
                  notifications: 0,
                  updated: 0
                };
                data_member_after_check.push(obj);
              }
            }
          )
          .catch(
            err => {
              this.showPopUp(Utils.TITLE_ERROR, 'ALERT.NOT_AVALIABLE', CrudType.CANCEL);
              this.componentAction.hideLoading();
            }
          );
      } else {
        let obj = {
          owner: data_member_check[index]['user']['id'] === item['id_owner'] ? true : false,
          id_owner: item['id_owner'],
          nickname: data_member_check[index]['user']['id'],
          id_user: data_member_check[index]['user']['id'],
          profile: data_member_check[index]['user']['url_avatar'],
          name: data_member_check[index]['user']['nick_name'],
          active: false,
          user_name: data_member_check[index]['user']['id'],
          email: data_member_check[index]['user']['email'],
          fullname: data_member_check[index]['user']['first_name'] + data_member_check[index]['user']['last_name'],
          phone_number: data_member_check[index]['user']['phone'],
          smile: data_member_check[index]['user']['nick_name'],
          old: data_member_check[index]['user']['age'],
          gender: data_member_check[index]['user']['gender'],
          lang: data_member_check[index]['user']['language_id'],
          index: 0,
          conversation_id: undefined,
          qr_code: this.data_blind.qr_code_group,
          notifications: 0,
          updated: 0
        };
        data_member_after_check.push(obj);
      }
    }
    this.data.members = data_members.concat(data_member_after_check);
    this.data.members.sort(
      function (first, second) {
        return first['index'] - second['index'];
      }
    );
    if (!conversation_member) {
      item['notifications'] = this.caculatorNotification(this.data.members);
      this.socketService.turnOffNotification(item['conversation_id']);
      this.data.accept_chat = false;
      this.getMessages(this.data_blind.id_converstation_group_current);
    }
    if (conversation_member) {
      this.handleMember(conversation_member);
      this.getMessages(this.data_blind.id_converstation_member_current);
    }
    this.componentAction.hideLoading();
  }
  // member list
  getMemberOfGroup(item) {
    return new Promise((resolve, reject) => {
      this.mainService.getListMember(item['qr_code']).subscribe(
        result => {
          let arrMerge = [];
          result['messages'].concat(result['requested'], result['sent']).forEach(element => {
            let obj = {
              owner: item['id_owner'] === element['user']['id'] ? true : false,
              id_owner: item['id_owner'],
              nickname: element['user']['id'],
              id_user: element['user']['id'],
              profile: element['user']['url_avatar'],
              name: element['user']['nick_name'],
              active: false,
              user_name: element['user']['id'],
              email: element['user']['email'],
              fullname: element['user']['first_name'] + element['user']['last_name'],
              phone_number: element['user']['phone'],
              smile: element['user']['nick_name'],
              old: element['user']['age'],
              gender: element['user']['gender'],
              lang: element['user']['language_id'],
              index: item['id_owner'] === element['user']['id'] ? 0 : 1,
              conversation_id: element['conversation_id'],
              qr_code: element['qr_code'] || this.data_blind.qr_code_group,
              notifications: element['total_notification'],
              updated: element['message'] ?
                this.timeService.getTimeFormatFromDate(element['message']['updatedAt'], this.timeService.LAST_HOUR_MINUTES) :
                this.timeService.getTimeFormatFromDate(element['createdAt'], this.timeService.LAST_HOUR_MINUTES)
            };
            arrMerge.push(obj);
          });
          resolve({ member: arrMerge, others: result['others'] });
        },
        err => {
          reject(err);
        }
      );
    });
  }
  // get messgage
  getMessages(conversation_id) {
    this.mainService.getMessage(conversation_id, 0, Limit.MESSAGE).subscribe(
      res => {
        this.data.client_height = 0;
        res.forEach(element => {
          // default
          if (element['status'] == STATUS) {
            let object_default = {
              createdAt: element['createdAt'],
              message_type: element['message_type'],
              message: element['message'],
              type_message: this.userService.getUserInfo()['id'] === element['sender_id'] ? TypeMessage.SENT : TypeMessage.RECEVEI
            };
            // this.data.messages_translate.ja.unshift(object_default);
            // translate
            let object_translate = {
              createdAt: element['createdAt'],
              message_type: element['message_type'],
              message: element['message_type'] === 'text' ? element['translate_message'] : element['message'],
              type_message: this.userService.getUserInfo()['id'] === element['sender_id'] ? TypeMessage.SENT : TypeMessage.RECEVEI
            };
            // this.data.messages_translate.en.unshift(object_translate);
            // check
            if (this.data.lang === element['lang'] && element['lang'] === Utils.JA) {
              this.data.messages_translate[Utils.JA].unshift(object_default);
              this.data.messages_translate[Utils.EN].unshift(object_translate);
            }
            if (this.data.lang === element['lang'] && element['lang'] === Utils.EN) {
              this.data.messages_translate[Utils.EN].unshift(object_default);
              this.data.messages_translate[Utils.JA].unshift(object_translate);
            }
            if (this.data.lang !== element['lang'] && element['lang'] === Utils.EN && this.data.lang === Utils.JA) {
              this.data.messages_translate[Utils.EN].unshift(object_default);
              this.data.messages_translate[Utils.JA].unshift(object_translate);
            }
            if (this.data.lang !== element['lang'] && element['lang'] === Utils.JA && this.data.lang === Utils.EN) {
              this.data.messages_translate[Utils.JA].unshift(object_default);
              this.data.messages_translate[Utils.EN].unshift(object_translate);
            }
          }
        });
        this.data.messages = this.data.messages_translate[this.data.lang];
        $('#group-member-mess').animate({
          scrollTop: 99999999
        }, 1000);
        setTimeout(() => {
          this.data.client_height = document.getElementById('group-member-mess').scrollHeight;
        }, 1000);
      }
    );
  }
  //loadmore
  async  loadmore() {
    if (document.getElementById('group-member-mess').scrollTop === 0) {
      this.data.offset_mess += Limit.MESSAGE;
      this.componentAction.showLoading();
      await this.getMessagesLoad(this.data.offset_mess).then(
        result => {
          setTimeout(() => {
            $('#group-member-mess').scrollTop(this.data.client_height);
          }, 1);
          this.componentAction.hideLoading();
        }
      ).catch(
        err => {
          this.componentAction.hideLoading();
        }
      );
    }
  }
  // loadmore message
  getMessagesLoad(offset) {
    return new Promise((resolve, reject) => {
      this.mainService.getMessage(this.data_blind.id_converstation, offset, Limit.MESSAGE).subscribe(
        res => {
          if (res.length > 0) {
            res.forEach(element => {
              // default
              if (element['status'] == STATUS) {
                let object_default = {
                  createdAt: element['createdAt'],
                  message_type: element['message_type'],
                  message: element['message'],
                  type_message: this.userService.getUserInfo()['id'] === element['sender_id'] ? TypeMessage.SENT : TypeMessage.RECEVEI
                };
                // translate
                let object_translate = {
                  createdAt: element['createdAt'],
                  message_type: element['message_type'],
                  message: element['message_type'] === 'text' ? element['translate_message'] : element['message'],
                  type_message: this.userService.getUserInfo()['id'] === element['sender_id'] ? TypeMessage.SENT : TypeMessage.RECEVEI
                };

                if (this.data.lang === element['lang'] && element['lang'] === Utils.JA) {
                  this.data.messages_translate[Utils.JA].unshift(object_default);
                  this.data.messages_translate[Utils.EN].unshift(object_translate);
                }
                if (this.data.lang === element['lang'] && element['lang'] === Utils.EN) {
                  this.data.messages_translate[Utils.EN].unshift(object_default);
                  this.data.messages_translate[Utils.JA].unshift(object_translate);
                }
                if (this.data.lang !== element['lang'] && element['lang'] === Utils.EN && this.data.lang === Utils.JA) {
                  this.data.messages_translate[Utils.EN].unshift(object_default);
                  this.data.messages_translate[Utils.JA].unshift(object_translate);
                }
                if (this.data.lang !== element['lang'] && element['lang'] === Utils.JA && this.data.lang === Utils.EN) {
                  this.data.messages_translate[Utils.JA].unshift(object_default);
                  this.data.messages_translate[Utils.EN].unshift(object_translate);
                }
              }
            });
            resolve([]);
          } else {
            reject([]);
          }
        },
        err => {
        }
      );
    });
  }
  // hide menu
  clickOutSide() {
    if (document.getElementById('menu').style.display === 'block') {
      document.getElementById('menu').style.display = 'none';
    }
  }
  // sum notification
  caculatorNotification(arrMember) {
    let sum = 0;
    for (let index = 0; index < arrMember.length; index++) {
      if (arrMember[index]['notifications']) {
        sum += arrMember[index]['notifications'];
      }
    }
    return sum;
  }
  // subtraction notification
  caculatorNotificationMember(conversation_id) {
    for (let index = 0; index < this.data.members.length; index++) {
      if (this.data.members[index]['conversation_id'] === conversation_id) {
        return this.data.members[index]['notifications'];
      }
    }
  }
  // message lang
  changelang(value) {
    this.data.messages = this.data.messages_translate[value];
    this.langservice.toogleLangTranslate(value);
  }

  // Await tranlate
  translateText(data) {
    return new Promise((resolve, reject) => {
      let lang_translate;
      if (this.data.lang === Utils.JA) {
        lang_translate = Utils.EN;
      }
      if (this.data.lang === Utils.EN) {
        lang_translate = Utils.JA;
      }
      this.mainService.translateGoogle(data, this.data.lang, lang_translate).subscribe(
        res => {
          resolve(res['data']);
        },
        err => {
          resolve({ translations: [{ translatedText: data }] });
        }
      );
    });
  }
  // sent message
  async sentMessage(data) {
    // emit 
    let body = {
      conversation_id: this.data_blind.id_converstation,
      guid: UUID.UUID(),
      sender_id: this.userService.getUserInfo()['id'],
      message: data.trim(),
      message_type: 'text',
      attachment_thumb_url: this.userService.getUserInfo()['url_avatar'],
      attachment_url: '',
      name: this.userService.getUserInfo()['nick_name'],
      translate_message: '',
      lang: this.data.lang,
      qr_code: this.data_blind.qr_code_group,
      id_owner: this.data_blind.id_owner,
      is_group_talk: '0',
      title: this.data_blind.id_group_name,
      status: 0
    };

    await this.translateText(data).then(
      resTranslate => {
        body['translate_message'] = resTranslate['translations'][0]['translatedText'];
        this.socketService.setMessage(body);
        this.scrollBottom();
      }
    );
  }

  scrollBottom() {
    let a = document.getElementById('group-member-mess').scrollHeight;
    $('#group-member-mess').animate({
      scrollTop: a
    }, 1000);
  }
  // create 
  createConverSation(body) {
    return new Promise((resolve, reject) => {
      this.mainService.createConverSation(body).subscribe(
        res => {
          resolve({ conversation_id: res.id });
        }, err => {
          reject(err);
        }
      );
    });
  }
  // join
  joinConverSation(body, conversation_id) {
    return new Promise((resolve, reject) => {
      return this.mainService.joinConveSation(body, conversation_id).subscribe(
        res => {
          resolve({ join: true, conversation_id: res[0]['conversation_id'] });
        }, err => {
          reject(err);
        }
      );
    });
  }
  // check
  checkAvaliableConversation(creator, victom, qr_code) {
    return new Promise((resolve, reject) => {
      return this.mainService.checkAvaliableConversation(creator, victom, qr_code).subscribe(
        res => {
          if (res.id) {
            resolve({ created: true, conversation_id: res.id, conver: res });
          } else {
            resolve({ created: false });
          }
        }, err => {
          reject(err);
        }
      );
    });
  }
  //HANDLE MEMBER
  handleMember(conversation_member) {
    // caculator notifi
    for (let index = 0; index < this.data.groups.length; index++) {
      if (this.data.groups[index]['conversation_id'] === this.data_blind.id_converstation_group_current) {
        this.data.groups[index]['notifications'] = (this.data.groups[index]['notifications'] - this.caculatorNotificationMember(conversation_member)) > 0
          ? (this.data.groups[index]['notifications'] - this.caculatorNotificationMember(conversation_member)) : 0;
        break;
      }
    }
    // active current member
    for (let index = 0; index < this.data.members.length; index++) {
      if (this.data.members[index]['conversation_id'] === conversation_member) {
        this.data.members[index]['active'] = true;
        this.data.members[index]['notifications'] = 0;
        this.socketService.turnOffNotification(conversation_member);
        if (this.data.members[index]['id_owner'] === this.userService.getUserInfo()['id'] || this.data.members[index]['owner'] === true) {
          this.data.accept_chat = true;
        } else {
          this.data.accept_chat = false;
        }
        break;
      }
    }

    if (this.socketService.socket) {
      this.socketService.disconnect();
    }
    this.socketService.connect();
    this.data_blind.id_converstation = conversation_member;
    this.data.messages = [];
    this.data.messages_translate['ja'] = [];
    this.data.messages_translate['en'] = [];
    this.listenMember(conversation_member);
  }

  listenMember(conversation_id) {
    // authentication
    this.socketService.authetication().subscribe(
      authe => {
        // new message in current group
        this.socketService.listenMessage(conversation_id).subscribe(
          res_message => {
            //default
            if (res_message['status'] == STATUS) {
              let object_default = {
                createdAt: res_message['createdAt'],
                message_type: res_message['message_type'],
                message: res_message['message'],
                type_message: this.userService.getUserInfo()['id'] === res_message['sender_id'] ? TypeMessage.SENT : TypeMessage.RECEVEI
              };
              //translate
              let object_translate = {
                createdAt: res_message['createdAt'],
                message_type: res_message['message_type'],
                message: res_message['message_type'] === 'text' ? res_message['translate_message'] : res_message['message'],
                type_message: this.userService.getUserInfo()['id'] === res_message['sender_id'] ? TypeMessage.SENT : TypeMessage.RECEVEI
              };
              // check
              if (this.data.lang === res_message['lang'] && res_message['lang'] === Utils.JA) {
                this.data.messages_translate[Utils.JA].push(object_default);
                this.data.messages_translate[Utils.EN].push(object_translate);
              }
              if (this.data.lang === res_message['lang'] && res_message['lang'] === Utils.EN) {
                this.data.messages_translate[Utils.EN].push(object_default);
                this.data.messages_translate[Utils.JA].push(object_translate);
              }
              if (this.data.lang !== res_message['lang'] && res_message['lang'] === Utils.EN && this.data.lang === Utils.JA) {
                this.data.messages_translate[Utils.EN].push(object_default);
                this.data.messages_translate[Utils.JA].push(object_translate);
              }
              if (this.data.lang !== res_message['lang'] && res_message['lang'] === Utils.JA && this.data.lang === Utils.EN) {
                this.data.messages_translate[Utils.JA].push(object_default);
                this.data.messages_translate[Utils.EN].push(object_translate);
              }
              this.scrollBottom();
            }
          }
        );
        //  new message another list
        this.socketService.listenListGroups().subscribe(
          res_list => {
            if (res_list['message']['status'] == STATUS) {
              if (res_list['qr_code'] !== this.data_blind.qr_code_group) {
                for (let index = 0; index < this.data.groups.length; index++) {
                  if (this.data.groups[index]['qr_code'] === res_list['qr_code']) {
                    this.data.groups[index]['notifications'] += res_list['total'];
                    this.data.groups[index]['updated'] =
                      this.timeService.getTimeFormatFromDate(res_list['message']['createdAt'], this.timeService.LAST_HOUR_MINUTES);
                    break;
                  }
                }
              }
              // not out
              if (this.data_blind.qr_code_group === res_list['qr_code']) {
                if (this.data_blind.id_converstation_member_current) {
                  // curent
                  if (res_list['message']['conversation_id'] === this.data_blind.id_converstation_member_current) {
                    this.socketService.turnOffNotification(this.data_blind.id_converstation_member_current);
                  }
                  // CHECK HAVE NEW MEMBER
                  let obj = this.data.members.find(function (o) {
                    return o['id_user'] === res_list['message']['sender_id'];
                  });
                  if (obj) {
                    // another member inside group
                    if (res_list['message']['conversation_id'] !== this.data_blind.id_converstation_member_current) {
                      for (let index = 0; index < this.data.members.length; index++) {
                        if (this.data.members[index]['conversation_id'] === res_list['message']['conversation_id']) {
                          this.data.members[index]['notifications'] += res_list['total'];
                          this.data.members[index]['updated'] =
                            this.timeService.getTimeFormatFromDate(res_list['message']['createdAt'], this.timeService.LAST_HOUR_MINUTES);
                          break;
                        }
                      }
                      for (let second = 0; second < this.data.groups.length; second++) {
                        if (this.data.groups[second]['qr_code'] === res_list['qr_code']) {
                          this.data.groups[second]['notifications'] += res_list['total'];
                          this.data.groups[second]['updated'] =
                            this.timeService.getTimeFormatFromDate(res_list['message']['createdAt'], this.timeService.LAST_HOUR_MINUTES);
                          break;
                        }
                      }
                    }
                  } else {
                    // new
                    let obj_group = this.data.groups.find(function (o) {
                      return o['qr_code'] === res_list['qr_code'];
                    });
                    if (obj_group) {
                      obj_group['count'] += 1;
                      this.handleGroup(obj_group, this.data_blind.id_converstation_member_current)
                    }
                  }
                }
              }
            }
          }
        );
      });
  }

  //choose member
  async  chooseMember(item) {
    if (item['active'] === false) {
      // if current user was owner || member is owner
      if (item['id_owner'] === this.userService.getUserInfo()['id'] || item['owner'] === true) {
        this.data.accept_chat = true;
        // current was owner
        // current user  was owner || not which has chat together
        if ((item['id_owner'] === this.userService.getUserInfo()['id'] && item['conversation_id']) ||
          (item['id_owner'] !== this.userService.getUserInfo()['id'] && item['conversation_id'])
        ) {
          this.router.navigate(['/dashboard'],
            {
              queryParams: {
                conversation_id: this.data_blind.id_converstation_group_current,
                code: item['qr_code'],
                member: item['conversation_id']
              }
            });
          // console.log('1 : current user  was owner || not which has chat together');
        }
        // current user was owner which hasnot chat together
        if ((item['id_owner'] === this.userService.getUserInfo()['id'] && !item['conversation_id'])
          || (item['id_owner'] !== this.userService.getUserInfo()['id'] && !item['conversation_id'])
        ) {
          // console.log('2 : current user  was owner which hasnot chat together');
          // create room chat
          const body_create_room = {
            creator_id: this.userService.getUserInfo()['id'],
            title: `${this.userService.getUserInfo()['id']}_Chat Single`,
            qr_code: item['qr_code'],
            channel_id: null,
            user_conversation_id: item['id_user']
          };
          let check;
          await this.checkAvaliableConversation(this.userService.getUserInfo()['id'], item['id_user'], item['qr_code']).then(
            resCheck => {
              check = resCheck;
            }
          ).catch(
            errCheck => {
              this.showPopUp(Utils.TITLE_ERROR, errCheck['message'], CrudType.CANCEL);
              check = undefined;
            }
          );
          if (check['created'] === false) {
            await this.createConverSation(body_create_room).then(
              res_create => {
                if (res_create) {
                  const body_join = {
                    user_id: item['id_user'],
                    type: 'single',
                  };
                  this.joinConverSation(body_join, res_create['conversation_id']).then(
                    resJoin => {
                      // insert data
                      // this.data.members[this.data.members.indexOf(item)]['conversation_id'] = res_create['conversation_id'];
                      item['conversation_id'] = res_create['conversation_id'];
                      this.router.navigate(['/dashboard'],
                        {
                          queryParams: {
                            conversation_id: this.data_blind.id_converstation_group_current,
                            code: item['qr_code'],
                            member: item['conversation_id'],
                            user: item['id_user']
                          }
                        });
                    }
                  ).catch(
                    errJoin => {
                      this.showPopUp(Utils.TITLE_ERROR, errJoin['message'], CrudType.CANCEL);
                    }
                  );
                }
              }
            ).catch(
              err_create => {
                this.showPopUp(Utils.TITLE_ERROR, err_create['message'], CrudType.CANCEL);
              }
            );
          }
          if (check['created'] === true) {
            this.data.members[this.data.members.indexOf(item)]['conversation_id'] = check['conversation_id'];
            item['conversation_id'] = check['conversation_id'];
            this.router.navigate(['/dashboard'],
              {
                queryParams:
                {
                  conversation_id: this.data_blind.id_converstation_group_current,
                  member: item['conversation_id'],
                  code: item['qr_code'],
                  user: item['id_user']
                }
              });
          }
        }

      } else {
        this.data.accept_chat = false;
        this.showPopUp(Utils.TITLE_ERROR, 'ALERT.NOT_AVALIABLE', CrudType.CANCEL);
      }
    }
  }
  // ALERT
  saveConfirm() {
    $('#alert-contact').modal('hide');
  }

  showPopUp(title, message, mode) {
    this.message.title = title;
    this.message.message = message;
    this.message.mode = mode;
    $('#alert-contact').modal('show');
  }
}
