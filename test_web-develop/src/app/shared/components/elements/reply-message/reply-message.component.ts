import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reply-message',
  templateUrl: './reply-message.component.html',
  styleUrls: ['./reply-message.component.scss']
})
export class ReplyMessageComponent implements OnInit {
  @Output() outputSent = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  emitData(data) {
    if (data) {
      (<HTMLInputElement>document.getElementById('text')).value = '';
      this.outputSent.emit(data);
    }
  }

}
