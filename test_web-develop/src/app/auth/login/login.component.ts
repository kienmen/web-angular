import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/helpers/validation.service';
import { ComponentActions } from 'src/app/shared/components/alert/component-actions';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from 'src/app/shared/enums/utils';
import { CrudType } from 'src/app/shared/enums/crud-type.enum';
import { environment as config } from '../../../../src/environments/environment';
import { StorageService } from 'src/app/shared/services/user/storageService';
import { EncodeDecodeService } from 'src/app/shared/services/helpers/encode-decode.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  validationMessages = {
    account_name: {
      required: 'FORM_VALIDATE.ACCOUNT_NAME_REQUIRED',
    },
    password: {
      required: 'FORM_VALIDATE.PASSWORD_REQUIRED',
      minlength: 'FORM_VALIDATE.PASSWOR_MIN',
      maxlength: 'FORM_VALIDATE.PASSWORD_MAX'
    }
  };
  message = {
    title: "",
    message: "",
    mode: 0
  };
  formErrors = {
    account_name: '',
    password: ''
  };
  param_id;
  case_log = null;
  constructor(
    private formbuilder: FormBuilder,
    private validationService: ValidationService,
    private componentAction: ComponentActions,
    private userService: UserService,
    private router: Router,
    private storage: StorageService,
    private activeRouter: ActivatedRoute,
    private encodeDecode: EncodeDecodeService
  ) { }

  ngOnInit() {
    this.initForm();
    this.activeRouter.queryParams.subscribe(
      params => {
        if (params['id']) {
          this.param_id = params.id;
          this.case_log = true;
        }
      }
    );
  }

  ngAfterContentInit(): void {
    this.formLogin.controls.account_name.setValue(this.param_id);
  }

  initForm() {
    this.formLogin = this.formbuilder.group(
      {
        account_name: ['', [
          Validators.required
        ]],
        password: ['', [
          Validators.minLength(8),
          Validators.maxLength(40),
          Validators.required]]
      }
    );
    this.formLogin.valueChanges.subscribe(data => this.onValueChanged(data));
  }
  onValueChanged(data?: any) {
    const form = this.formLogin;
    this.validationService.getValidate(form, this.formErrors, this.validationMessages);
  }
  saveConfirm() {
    $('#alert-login').modal('hide');
  }

  showPopUp(title, message, mode) {
    this.message.title = title;
    this.message.message = message;
    this.message.mode = mode;
    $('#alert-login').modal('show');
  }

  handlelogin() {
    this.componentAction.showLoading();
    let path = this.router.url.indexOf(config.routerLoginAdmin) > 0 ? true : false;
    const body_admin = {
      nick_name: this.formLogin.value.account_name,
      password: this.formLogin.value.password,
      language_cd: this.storage.getLang()
    };

    const body = {
      id: this.case_log ? this.formLogin.value.account_name : this.encodeDecode.encode(this.formLogin.value.account_name) ,
      password: this.formLogin.value.password
    };
    this.userService.doLogin(path ? 'login/admin' : 'login/id', path ? body_admin : body).subscribe(
      res => {
        this.componentAction.hideLoading();
        this.userService.setUserInfo(res, this.case_log ? this.case_log : '');
        this.userService.login(true);
        if (path) {
          this.router.navigate([`/${config.routerLoginAdmin}`]);
        } else {
          this.router.navigate([`/scanner`]);
        }
      }, err => {
        this.componentAction.hideLoading();
        this.showPopUp(Utils.TITLE_ERROR, err.message, CrudType.CANCEL);
      }
    );
  }
}