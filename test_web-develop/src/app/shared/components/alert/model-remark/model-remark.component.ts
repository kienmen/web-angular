import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudType } from '../../../enums/crud-type.enum';

@Component({
  selector: 'app-model-remark',
  templateUrl: './model-remark.component.html',
  styleUrls: ['./model-remark.component.scss']
})
export class ModelRemarkComponent implements OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() mode: CrudType;
  @Input() content='Reason';  
  @Output() saveConfirm = new EventEmitter();
  errorForm;
  remarkForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.remarkForm = this.formBuilder.group({
      remark: ['', [Validators.required]]
    });
    
  }

  error(){
    this.errorForm=true;
  }

  getValueFromFormName(name) {
    return this.remarkForm.controls[name].value;
}

  save(){
    this.saveConfirm.emit({result:this.getValueFromFormName('remark')})
  }

}
