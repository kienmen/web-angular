import { Component, OnInit } from '@angular/core';
import { ComponentActions } from 'src/app/shared/components/alert/component-actions';
import { TopService } from '../top.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Router } from '@angular/router';
const ACTION = {
  SAVE: 1,
  CLOSE: 2,
  BACK: 3,
  RESENT: 4
};
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showRegis = false;
  case_register;
  result_text = {
    status_code: 400,
    message: '',
    success: false
  };
  constructor(
    private componentAction: ComponentActions,
    private topservive: TopService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  listener(evt) {
    if (evt['status'] === ACTION.SAVE) {
      this.componentAction.showLoading();
      this.topservive.register(evt['data']).subscribe(
        res => {
          this.result_text.status_code = 200;
          this.result_text.message = 'REGISTER.REGISTER_SUCCESS';
          this.result_text.success = true;
          this.componentAction.hideLoading();
        },
        err => {
          // this.result_text = err;
          this.result_text.status_code = 200;
          this.result_text.message = 'REGISTER.REGISTER_ERROR';
          this.componentAction.hideLoading();
        }
      );

    }
    if (evt['status'] === ACTION.BACK) {
      this.result_text.status_code = 400;
      this.result_text.message = '';
      this.result_text.success = false;
      return;
    }
    if (evt['status'] === ACTION.RESENT) {
      return;

    }
    if (evt['status'] === ACTION.CLOSE) {
      this.showRegis = false;
      this.result_text.status_code = 400;
      this.result_text.message = '';
      this.result_text.success = false;
      return;
    }
  }


  show(value) {
    this.case_register = value;
    if (value == 2) {
      if (this.userService.getUserInfo()) {
        this.router.navigate(['/scanner']);
      } else {
        this.showRegis = true;
      }
    } else {
      this.showRegis = true;
    }
  }

  registerEmail(ev) {
    this.componentAction.showLoading();
    this.userService.register(ev).subscribe(
      res => {
        this.componentAction.hideLoading();
        this.router.navigate(['/scanner']);

      },
      err => {
        this.componentAction.hideLoading();
        this.result_text.status_code = 200;
        this.result_text.message = 'REGISTER.REGISTER_ERROR';
      }
    );

  }

}
