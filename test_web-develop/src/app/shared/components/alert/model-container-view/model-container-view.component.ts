
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { CrudType } from '../../../enums/crud-type.enum';
declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'app-model-container-view',
  templateUrl: './model-container-view.component.html',
  styleUrls: ['./model-container-view.component.scss']
})
export class ModelContainerViewComponent implements OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() formGroup: FormGroup;
  @Input() mode: CrudType;
  @Output() cancel = new EventEmitter<any>();

  @Output() save = new EventEmitter<any>();
  @Output() error = new EventEmitter<any>();
  @Output() reset = new EventEmitter<any>();
  crudType = CrudType;
  permission;
  constructor() {
  }

  ngOnInit() {
  }
  
  ngOnChanges(changes): void {
  }

  saveData() {
    if (this.formGroup.valid) {
      this.save.emit();
      this.formGroup
    } else {
      this.error.emit();
    }
  }

  cancelForm() {
    this.cancel.emit();
  }

  resetForm() {
    this.formGroup.reset()
    this.reset.emit();
    this.cancel.emit();
  }

}
