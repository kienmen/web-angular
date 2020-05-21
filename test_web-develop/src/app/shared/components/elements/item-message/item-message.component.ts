import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Limit, TypeMessage } from 'src/app/shared/enums/limit.enum';

@Component({
  selector: 'app-item-message',
  templateUrl: './item-message.component.html',
  styleUrls: ['./item-message.component.scss']
})
export class ItemMessageComponent implements OnInit {
  @Input() item = {};
  @Input() type = 1;
  @Input() left = 1;

  @Output() ouputClick = new EventEmitter();
  link_assets;
  typeMessage;
  constructor() {
    this.typeMessage = TypeMessage;
   }

  ngOnInit() {
  }

  ngOnChanges() {
    this.link_assets = `${environment.host_image}/${this.item['message']}`;
  }

  handleClick() {
    this.ouputClick.emit(this.item);
  }


}
