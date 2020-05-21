import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../delete/delete.component.scss']
})
export class EditComponent implements OnInit {
  formEdit: FormGroup;
  @Input() data = {};
  @Output() ouputClick = new EventEmitter();
  constructor(private homeService: HomeService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formEdit = this.formBuilder.group(
      {
        title: ['', Validators.required],
        new_user_setting: ['', Validators.required],
        id: ['', Validators.required]
      }
    );
    this.formEdit.patchValue(this.data);
  }
  cancel() {
    this.homeService.nextEdit(false);
  }

  ngOnChanges(): void {
  }

  edit() {
    this.ouputClick.emit(this.formEdit.value);
  }

  chooseType(type) {
    this.formEdit.get('new_user_setting').setValue(type);
  }
}
