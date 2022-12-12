import {Injectable} from "@angular/core";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {JgsAppTitleStrategy} from "./jgs-app-title.strategy";

@Injectable()
export class JgsTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title, private readonly translate: TranslateService, private readonly appTitle: JgsAppTitleStrategy) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    this.appTitle.updateTitleFromStrategy(title ?? 'title');
    setTimeout(() => {
      this.title.setTitle(this.translate.instant('title'));
    }, 0);
  }
}
