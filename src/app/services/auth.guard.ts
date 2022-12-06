import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    console.log('guard');
    const isAuthorized = await this.authService.isSignedIn();
    console.log(isAuthorized);
    if (isAuthorized) {
      return true;
    }
    const redirectUrl = !isAuthorized
      ? 'auth/actions'
      : state.url;
    const queryParams = !isAuthorized
      ? {'mode': 'verify-email'}
      : {}
    await this.router.navigate(['auth/actions/verify-email'], {relativeTo: this.activatedRoute, queryParams: {'redirectUrl': redirectUrl}});
    return false;
  }

}
