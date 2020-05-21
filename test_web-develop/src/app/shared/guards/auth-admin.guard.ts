import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { StorageService } from '../services/user/storageService';
import { environment } from 'src/environments/environment';
import { UserRole } from '../enums/user-role';

// project import

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private storage: StorageService) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.storage.getUserInfo() && this.storage.getUserInfo()['role'] === UserRole.ADMIN) {
      return true;
    }
    if (this.storage.getUserInfo() && (!this.storage.getUserInfo()['role'] || this.storage.getUserInfo()['role'] === UserRole.NORMAL)) {
      this.router.navigate([`/dashboard`]);
      return false;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate([`/${environment.routerLoginAdmin}/login`]);
    return false;
  }
}
