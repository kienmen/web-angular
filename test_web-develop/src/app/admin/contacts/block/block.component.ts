import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['../delete/delete.component.scss']
})
export class BlockComponent implements OnInit {
  @Output() ouputClick = new EventEmitter();
  constructor(private homeService: HomeService) { }

  ngOnInit() {
  }

  cancel() {
    this.homeService.nextBlock(false);
  }

  block() {
    this.ouputClick.emit();
  }
}