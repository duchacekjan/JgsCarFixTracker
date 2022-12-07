import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthActionsGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const isAuthorized = (await this.authService.isSignedIn()) !== null;
    console.log(`actions guard: ${isAuthorized}`)
    if (!isAuthorized) {
      await this.router.navigate(['auth/sign-in'], {relativeTo: this.activatedRoute, queryParams: {'redirectUrl': state.url}});
    }
    return isAuthorized;
  }

}
