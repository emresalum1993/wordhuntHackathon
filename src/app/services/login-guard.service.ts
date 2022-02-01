import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { UserServiceService } from "./user-service.service";
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
  constructor(private userService: UserServiceService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let logged = this.userService.isLoggedIn();

    if (logged) {
      return true;
    }
    this.router.navigate(["login"]);
    return false;
  }
}
