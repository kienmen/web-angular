import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  showmenu() {
    document.getElementById('menu').style.display = 'block';
  }

  logout() {
    this.userService.doLogout().subscribe(
      res => {
        this.userService.login(false);
        this.userService.removeUserInfo();
        this.router.navigate([`/login`]);
      }
    );
  }
}
