import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CrudType } from '../../../enums/crud-type.enum';

@Component({
  selector: 'app-alert-confirm',
  templateUrl: './alert-confirm.component.html',
  styleUrls: ['./alert-confirm.component.scss']
})
export class AlertConfirmComponent implements OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() message: string;
  @Input() messageError: string;
  @Input() mode: CrudType;
  @Output() saveConfirm = new EventEmitter();
  @Output() cancel = new EventEmitter();
  confirmForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.confirmForm = this.formBuilder.group({});

  }
  save() {
    this.saveConfirm.emit();
  }
  error() {
  }

  cancelForm(){
    this.cancel.emit();
  }
}
