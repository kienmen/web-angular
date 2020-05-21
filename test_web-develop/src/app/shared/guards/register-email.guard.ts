import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserRole } from '../enums/user-role';
import { StorageService } from '../services/user/storageService';

// project import

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanActivate {
  constructor(private router: Router, private storage: StorageService) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // if (this.storage.getUserInfo() && (!this.storage.getUserInfo()['role'] || this.storage.getUserInfo()['role'] === UserRole.NORMAL)) {
    //   return true;
    // }
    // if (this.storage.getUserInfo() && this.storage.getUserInfo()['role'] === UserRole.ADMIN) {
    //   this.router.navigate([`/${environment.routerLoginAdmin}`]);
    //   return false;
    // }
    if (this.storage.getUserInfo()) {
      return true;
    }
    // if (this.storage.getUserInfo() && this.storage.getUserInfo()['role'] === UserRole.ADMIN) {
    //   this.router.navigate([`/${environment.routerLoginAdmin}`]);
    //   return false;
    // }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/register/email']);
    return false;
  }
}
