import { Component, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { HomeService } from 'src/app/admin/contacts/home.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { environment as config } from '../../../../../src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  watch_delete: SubscriptionLike;
  watch_block: SubscriptionLike;
  watch_edit: SubscriptionLike;
  watch_delete_message: SubscriptionLike;
  watch_detail: SubscriptionLike;
  data_blind = {
    showdelete: false,
    showblock: false,
    showedit: false,
    showdeletemessage: false,
    showdetail: false
  };
  constructor(
    private homeService: HomeService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.watch_delete = this.homeService.$s_delete.subscribe(
      data => {
        this.data_blind.showdelete = data;
      }
    );
    this.watch_delete = this.homeService.$s_block.subscribe(
      data => {
        this.data_blind.showblock = data;
      }
    );
    this.watch_delete = this.homeService.$s_edit.subscribe(
      data => {
        this.data_blind.showedit = data;
      }
    );
    this.watch_delete = this.homeService.$s_delete_message.subscribe(
      data => {
        this.data_blind.showdeletemessage = data;
      }
    );
    this.watch_delete = this.homeService.$s_showdetail.subscribe(
      data => {
        this.data_blind.showdetail = data;
      }
    );
  }

  delete() {
    if (
      this.check()
    ) {
      return;
    }
    this.homeService.nextDelete(true);
    document.getElementById('menu').style.display = 'none';
  }

  block() {
    if (
      this.check()
    ) {
      return;
    }
    this.homeService.nextBlock(true);
    document.getElementById('menu').style.display = 'none';

  }

  edit() {
    if (
      this.check()
    ) {
      return;
    }
    this.homeService.nextEdit(true);
    document.getElementById('menu').style.display = 'none';
  }


  check() {
    if (
      this.homeService.s_block.getValue() === true
      || this.homeService.s_delete.getValue() === true
      || this.homeService.s_edit.getValue() === true
      || this.homeService.s_delete_message.getValue() === true
      || this.homeService.s_showdetail.getValue() === true
    ) {
      return true;
    } else {
      return false;
    }
  }


  showmenu() {
    if (
      this.check()
    ) {
      return;
    }
    document.getElementById('menu').style.display = 'block';
  }

  logout() {
    this.userService.doLogout().subscribe(
      res => {
        this.userService.login(false);
        this.userService.removeUserInfo();
        this.router.navigate([`/${config.routerLoginAdmin}/login`]);
      }
    );
  }

  ngOnDestroy(): void {
    
  }
}
