import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Car} from "../../models/car";
import {CarsService} from "../../services/cars.service";
import {TranslateService} from "@ngx-translate/core";
import {JgsAppTitleStrategy} from "../jgs-app-title.strategy";

@Injectable({providedIn: 'root'})
export class AuthActionsTitleResolver implements Resolve<string> {

  constructor(private readonly translate: TranslateService, private readonly appTitle: JgsAppTitleStrategy) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    const mode = route.queryParamMap.get('mode') ?? '';
    const title = this.buildAuthActionsAppTitle(mode);
    console.log(title);
    this.appTitle.updateTitleFromResolver(title);
    return Promise.resolve(this.translate.instant('title'));
  }

  private buildAuthActionsAppTitle(mode: string): string {
    switch (mode) {
      case 'verifyEmail':
      case 'verifyAndChangeEmail':
        return 'auth.confirmVerifyEmail.title'
      case 'resetPassword':
        return 'auth.confirmResetPassword.title'
      default:
        return 'title';
    }
  }
}

