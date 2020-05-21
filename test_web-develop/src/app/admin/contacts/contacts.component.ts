import { Component, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ComponentActions } from 'src/app/shared/components/alert/component-actions';
import { Utils } from 'src/app/shared/enums/utils';
import { CrudType } from 'src/app/shared/enums/crud-type.enum';
import { HomeService } from './home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment as config } from '../../../../src/environments/environment';
const TYPE = {
  GROUP: 1,
  MESSAGE: 2
};
declare var $: any;
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})


export class ContactsComponent implements OnInit {
  data = {
    groups: [],
    messages: [],
    members: [],
    detail_room: {},
    detail_member: {},
    message_item: {},
    data_default: []
  };

  watch_delete: SubscriptionLike;
  watch_block: SubscriptionLike;
  watch_edit: SubscriptionLike;
  watch_delete_message: SubscriptionLike;


  data_blind = {
    idGroup: '',
    idMember: '',
    showdelete: false,
    showblock: false,
    showedit: false,
    showdetail: false,
    showDeleleMessage: false,
    steprole: 1,
    messagerole: '',
    qr_code: null
  };

  message = {
    title: '',
    message: '',
    mode: 0
  };

  constructor(
    private homeService: HomeService,
    private componentAction: ComponentActions,
    private activeRouted: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.watch();
  }

  async ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    await this.initData();
    this.activeRouted.queryParams.subscribe(
      params => {
        if (params.room) {
          this.data.groups.filter(element => {
            if (element['id'] === params.room) {
              this.handleGroup(element);
            } else {
              element['active'] = false;
            }
          });
        } else {
          if (this.data.groups.length > 0) {
            this.handleGroup(this.data.groups[0]);
          }
        }
      }
    );
  }

  watch() {
    this.watch_delete = this.homeService.$s_delete.subscribe(
      data => {
        this.data_blind.showdelete = data;
      }
    );
    this.watch_delete = this.homeService.$s_block.subscribe(
      data => {
        this.data_blind.showblock = data;
      }
    );
    this.watch_edit = this.homeService.$s_edit.subscribe(
      data => {
        this.data_blind.showedit = data;
      }
    );
    this.watch_delete_message = this.homeService.$s_delete_message.subscribe(
      data => {
        this.data_blind.showDeleleMessage = data;
      }
    );
    this.watch_delete = this.homeService.$s_showdetail.subscribe(
      data => {
        this.data_blind.showdetail = data;
      }
    );
  }

  initData() {
    return new Promise((resolve, reject) => {
      this.data.groups = [];
      this.homeService.getConversations().subscribe(
        res => {
          res.forEach(element => {
            let obj = {
              id: element['conversation_id'],
              profile: element['conversation']['user']['url_avatar'],
              name: element['conversation']['title'],
              count: element['count'],
              active: false,
              id_owner: element['conversation']['user']['id'],
              new_user_setting: element['conversation']['new_user_setting'],
              qr_code: element['conversation']['qr_code'],
            };
            this.data.groups.push(obj);
            this.data.data_default.push(obj);
          });
          resolve([]);
        }, err => {
          resolve([]);
        }
      );
    });
  }


  handleGroup(item) {
    if (!item['active']) {
      this.data_blind.idGroup = item['id'];
      this.data_blind.qr_code = item['qr_code'];
      this.data.groups.map(res => {
        res['active'] = false;
      });
      item['active'] = true;
      this.data.members = [];
      this.componentAction.showLoading();
      this.homeService.getMemberConversation(this.data_blind.idGroup).subscribe(
        res => {
          item['count'] = res.length;
          res.forEach(element => {
            let obj = {
              owner: item['id_owner'] === element['id'] ? true : false,
              case: item['id_owner'] === element['id'] ? 1 : 0,
              nickname: element['id'],
              id_user: element['id'],
              id: element['id'],
              profile: element['url_avatar'],
              name: element['nick_name'],
              active: false,
              user_name: element['id'],
              email: element['email'],
              fullname: element['first_name'] + element['last_name'],
              phone_number: element['phone'],
              smile: element['nick_name'],
              old: element['age'],
              gender: element['gender'],
              lang: element['language_id'],
            };
            this.data.members.push(obj);
          });
          this.componentAction.hideLoading();
        }, err => {
          this.componentAction.hideLoading();
        }
      );
      this.data.messages = [];
      this.homeService.getMessageConversation(this.data_blind.idGroup).subscribe(
        res => {
          res.forEach(element => {
            let object_default = {
              createdAt: element['createdAt'],
              message_type: element['message_type'],
              message: element['message'],
              type_message: 2
            };
            this.data.messages.push(object_default);
          });

          this.data.messages.sort(function (a, b) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          $('#messa').animate({
            scrollTop: 1000000000
          }, 1000);
        }
      );
      this.data.detail_room = {
        id: this.data_blind.idGroup,
        title: item['name'],
        new_user_setting: item['new_user_setting']
      };
      this.reset();


    }
  }

  chooseItem(item) {
    this.router.navigate([`/${config.routerLoginAdmin}`], { queryParams: { room: item['id'] } });
  }

  reset() {
    this.homeService.nextBlock(false);
    this.homeService.nextEdit(false);
    this.homeService.nextDelete(false);
    this.homeService.nextDeleteMessage(false);
    this.homeService.nextDetail(false);
    this.data_blind.showdetail = false;

  }

  chooseMember(item) {
    if (this.data_blind.showedit) {
      return;
    }
    this.data_blind.idMember = item['id'];
    this.data.members.map(res => {
      res['active'] = false;
    });
    item['active'] = true;
    this.data.detail_member = item;
    this.homeService.nextDetail(true);
  }
  // delete group
  deleleItemGroup(event) {
    if (event['type'] === TYPE.GROUP) {
      if (event['value']) {
        if (this.data_blind.showdelete) {
          this.componentAction.showLoading();
          this.homeService.deleteConvesation([this.data_blind.qr_code]).subscribe(
            res => {
              this.homeService.nextDelete(false);
              let objdeleteIndex = this.data.groups.findIndex(element => {
                if (element['id'] === this.data_blind.idGroup) {
                  return element;
                }
              });
              this.data.groups.splice(objdeleteIndex, 1);
              this.router.navigate([`${config.routerLoginAdmin}`]);
              this.showPopUp(Utils.TITLE_SUCCESS, res.message, CrudType.CANCEL);
              this.componentAction.hideLoading();
              this.data.data_default = this.data.groups;
            },
            err => {
              this.homeService.nextDelete(false);
              this.showPopUp(Utils.TITLE_ERROR, err.message, CrudType.CANCEL);
              this.componentAction.hideLoading();
            }
          );
        }
      } else {
        this.homeService.nextDelete(event['value']);
      }
    }
  }
  // delete history
  handleBlockItem() {
    if (this.data_blind.showblock) {
      this.componentAction.showLoading();
      const body = {
        conversation_id: this.data_blind.idGroup
      };
      this.homeService.deleteMessageOwner(body).subscribe(
        res => {
          this.homeService.nextBlock(false);
          this.data.messages = [];
          this.showPopUp(Utils.TITLE_SUCCESS, res.message, CrudType.CANCEL);
          this.componentAction.hideLoading();
        },
        err => {
          this.homeService.nextBlock(false);
          this.showPopUp(Utils.TITLE_ERROR, err.message, CrudType.CANCEL);
          this.componentAction.hideLoading();
        }
      );
    }
  }
  // edit group
  handleEditItem(event) {
    if (this.data_blind.showedit) {
      this.componentAction.showLoading();
      this.homeService.updateConvesation(event).subscribe(
        res => {
          this.homeService.nextEdit(false);
          this.showPopUp(Utils.TITLE_SUCCESS, 'ADMIN.EDIT.DELETE_SUCCESS', CrudType.CANCEL);
          this.data.groups.forEach((element) => {
            if (element['id'] === this.data_blind.idGroup) {
              element['new_user_setting'] = event['new_user_setting'];
              element['name'] = event['title'];
              this.data.detail_room = {
                id: this.data_blind.idGroup,
                title: event['name'],
                new_user_setting: event['new_user_setting']
              };
            }
          });
          this.data.data_default = this.data.groups;
          this.componentAction.hideLoading();
        },
        err => {
          this.homeService.nextEdit(false);
          this.showPopUp(Utils.TITLE_ERROR, err.message, CrudType.CANCEL);
          this.componentAction.hideLoading();
        }
      );
    }
  }

  closeMember() {
    this.homeService.nextDetail(false);
    this.data_blind.idMember = null;
    this.data.members.map(ele => {
      ele['active'] = false;
    });
    this.data_blind.steprole = 1;
  }

  handleUpgradeRole(evt) {
    console.log(evt);

    this.componentAction.showLoading();
    this.homeService.editRole({ id: evt['id'] }).subscribe(
      res => {
        this.data_blind.steprole = 2;
        this.data_blind.messagerole = 'ADMIN.ROLE.MESSAGE';
        this.componentAction.hideLoading();
      }, err => {
        this.data_blind.steprole = 2;
        this.data_blind.messagerole = err.message;
        this.componentAction.hideLoading();
      }
    );
  }

  deteteMessageItem(event) {
    const value = event;
    this.data.message_item = event;
    this.homeService.nextDeleteMessage(true);
  }

  handleDeteteMessage(event) {
    if (event['type'] === TYPE.MESSAGE) {
      if (event['value']) {
        const body = {
          message_id: this.data.message_item['id'],
          conversation_id: this.data_blind.idGroup
        };
        this.componentAction.showLoading();
        this.homeService.deleteMessageOwner(body).subscribe(
          res => {
            this.homeService.nextDeleteMessage(false);
            this.data.messages.splice(this.data.messages.indexOf(this.data.message_item), 1);
            this.showPopUp(Utils.TITLE_SUCCESS, res.message, CrudType.CANCEL);
            this.componentAction.hideLoading();
          },
          err => {
            this.homeService.nextDeleteMessage(false);
            this.showPopUp(Utils.TITLE_ERROR, err.message, CrudType.CANCEL);
            this.componentAction.hideLoading();
          }
        );
      } else {
        this.homeService.nextDeleteMessage(false);
      }
    }
  }

  clickOutSide() {
    if (document.getElementById('menu').style.display === 'block') {
      document.getElementById('menu').style.display = 'none';
    }
  }

  ngOnDestroy(): void {

  }

  saveConfirm() {
    $('#alert-contact').modal('hide');

  }

  showPopUp(title, message, mode) {
    this.message.title = title;
    this.message.message = message;
    this.message.mode = mode;
    $('#alert-contact').modal('show');
  }


  search(value) {
    let arr = [];
    if (value) {
      this.data.data_default.forEach(
        element => {
          if (element.name.indexOf(value) >= 0) {
            arr.push(element);
          }
        }
      );
      this.data.groups = arr;
    } else {
      this.data.groups = this.data.data_default;
    }

  }
}
