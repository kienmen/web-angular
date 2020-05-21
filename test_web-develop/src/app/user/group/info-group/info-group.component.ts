import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopService } from '../../top/top.service';
import { ComponentActions } from 'src/app/shared/components/alert/component-actions';
import { utils } from 'protractor';
import { CrudType } from 'src/app/shared/enums/crud-type.enum';
import { Utils } from 'src/app/shared/enums/utils';
declare var $: any;

@Component({
  selector: 'app-info-group',
  templateUrl: './info-group.component.html',
  styleUrls: ['./info-group.component.scss']
})
export class InfoGroupComponent implements OnInit {
  message = {
    title: '',
    message: '',
    mode: 0
  };
  id;
  info = {
    title: '',
    total_user: '',
    user: {
      nick_name: '',
      id: ''
    }
  };
  constructor(private activeRouter: ActivatedRoute, private topService: TopService,
    private componentAction: ComponentActions, private router: Router) { }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(
      params => {
        if (params.id) {
          this.id = params.id;
          this.initData(params.id);
        }
      }
    );
  }

  initData(id) {
    this.topService.scanQr(id).subscribe(res => {
      this.info = res;
    },
      err => {
        this.router.navigate(['/dashboard']);
      });
  }

  join() {
    if (this.info['id']) {
      this.componentAction.showLoading();
      this.topService.joinGroup(this.info['id']).subscribe(
        res => {
          this.componentAction.hideLoading();
          this.showPopUp(Utils.TITLE_ERROR, 'SCANNER.SUCCESS' , CrudType.CONFIRM);
        },
        err => {
          this.componentAction.hideLoading();
          this.showPopUp(Utils.TITLE_ERROR, err.message, CrudType.CANCEL);
        }
      );
    }
  }

  saveConfirm() {
    $('#alert-qr').modal('hide');
    if (this.message.mode === CrudType.CONFIRM) {
      this.router.navigate(['/dashboard']);
    }
  }

  showPopUp(title, message, mode) {
    this.message.title = title;
    this.message.message = message;
    this.message.mode = mode;
    $('#alert-qr').modal('show');
  }
}
