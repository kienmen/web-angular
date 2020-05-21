import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-group-user',
  templateUrl: './item-group-user.component.html',
  styleUrls: ['./item-group-user.component.scss']
})
export class ItemGroupUserComponent implements OnInit {
  @Input() item = {};
  @Input() type = false;
  @Input() showImage = false;


  @Output() ouputClick = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  handleClick(id) {
    this.ouputClick.emit(id);
  }

}
