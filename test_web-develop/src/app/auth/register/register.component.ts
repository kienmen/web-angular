import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/helpers/validation.service';
import { ComponentActions } from 'src/app/shared/components/alert/component-actions';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Router } from '@angular/router';
import { EncodeDecodeService } from 'src/app/shared/services/helpers/encode-decode.service';
import { Utils } from 'src/app/shared/enums/utils';
import { CrudType } from 'src/app/shared/enums/crud-type.enum';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.scss']
})
export class RegisterComponent implements OnInit {

  formRegister: FormGroup;
  validationMessages = {
    email: {
      required: 'FORM_VALIDATE.EMAIL_REQUIRED',
      email: 'FORM_VALIDATE.EMAIL_PATTERN',
    }
  };
  message = {
    title: "",
    message: "",
    mode: 0
  };
  formErrors = {
    account_name: '',
    password: '',
    email: ''
  };
  param_id;
  case_log = null;
  constructor(
    private formbuilder: FormBuilder,
    private validationService: ValidationService,
    private componentAction: ComponentActions,
    private userService: UserService,
    private router: Router,
    private encodeDecode: EncodeDecodeService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngAfterContentInit(): void {
    this.formRegister.controls.account_name.setValue(this.param_id);
  }

  initForm() {
    this.formRegister = this.formbuilder.group(
      {
        email: ['', [Validators.required, Validators.email]]
      }
    );
    this.formRegister.valueChanges.subscribe(data => this.onValueChanged(data));
  }
  onValueChanged(data?: any) {
    const form = this.formRegister;
    this.validationService.getValidate(form, this.formErrors, this.validationMessages);
  }
  saveConfirm() {
    $('#alert-register').modal('hide');
  }

  showPopUp(title, message, mode) {
    this.message.title = title;
    this.message.message = message;
    this.message.mode = mode;
    $('#alert-register').modal('show');
  }

  handlelogin() {
    this.componentAction.showLoading();

    this.userService.register(this.formRegister.value).subscribe(
      res => {
        this.componentAction.hideLoading();
      },
      err => {
        this.showPopUp(Utils.TITLE_ERROR, err.message, CrudType.CANCEL);
      }
    );
  }
}