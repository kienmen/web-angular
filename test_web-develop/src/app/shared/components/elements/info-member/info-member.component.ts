import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-info-member',
  templateUrl: './info-member.component.html',
  styleUrls: ['./info-member.component.scss']
})
export class InfoMemberComponent implements OnInit {
  @Input() info: any;
  @Input() step: any;
  @Input() messageRole: string;

  @Output() ouputClick = new EventEmitter();
  @Output() ouputClose = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  click() {
    this.ouputClick.emit(this.info);
  }

  close() {
    this.ouputClose.emit();
  }
}
