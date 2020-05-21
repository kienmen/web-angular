import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  @Output() ouputClick = new EventEmitter();
  @Input() text = '';
  @Input() type = 1;

  constructor() { }

  ngOnInit() {
  }

  cancel() {
    this.ouputClick.emit({type: this.type, value: false});
  }

  delete() {
    this.ouputClick.emit({type: this.type, value: true});
  }
}
