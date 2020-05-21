import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/helpers/validation.service';
import { Router } from '@angular/router';
const ACTION = {
  SAVE: 1,
  CLOSE: 2,
  BACK: 3,
  RESENT: 4
};
@Component({
  selector: 'app-register-tele',
  templateUrl: './register-tele.component.html',
  styleUrls: ['./register-tele.component.scss']
})
export class RegisterTeleComponent implements OnInit {
  @Output() ouputClick = new EventEmitter();
  @Input() message: any;
  @Input() case_register = 1;
  @Output() ouputRegister = new EventEmitter();


  fomrRegister: FormGroup;
  fomrRegisterEmail: FormGroup;
  validationMessages = {
    phone: {
      required: 'REGISTER.PHONE_REQUIRED',
      pattern: 'REGISTER.PHONE_PATTERN'
    },
    email: {
      required: 'FORM_VALIDATE.EMAIL_REQUIRED',
      email: 'FORM_VALIDATE.EMAIL_PATTERN',
    }
  };
  formErrors = {
    phone: '',
    email: ''
  };

  constructor(private formBuilder: FormBuilder, private validationService: ValidationService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.fomrRegister = this.formBuilder.group(
      {
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,11}')]]
      }
    );
    this.fomrRegister.valueChanges.subscribe(data => this.onValueChanged(data));

    this.fomrRegisterEmail = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]]
      }
    );
    this.fomrRegisterEmail.valueChanges.subscribe(data => this.onValueChanged2(data));

  }
  // Validators.pattern('^81+[0-9]{8,11}'
  onValueChanged(data?: any) {
    const form = this.fomrRegister;
    this.validationService.getValidate(form, this.formErrors, this.validationMessages);
  }
  onValueChanged2(data?: any) {
    const form = this.fomrRegisterEmail;
    this.validationService.getValidate(form, this.formErrors, this.validationMessages);
  }
  save() {
    this.ouputClick.emit({ status: ACTION.SAVE, data: this.fomrRegister.value });
  }

  close() {
    this.ouputClick.emit({ status: ACTION.CLOSE, data: this.fomrRegister.value });
  }

  back() {
    this.fomrRegister.reset();
    this.ouputClick.emit({ status: ACTION.BACK, data: this.fomrRegister.value });
  }

  resent() {
    this.ouputClick.emit({ status: ACTION.RESENT, data: this.fomrRegister.value });
  }


  registerEmail(){
    this.ouputRegister.emit(this.fomrRegisterEmail.value);
  }
}
