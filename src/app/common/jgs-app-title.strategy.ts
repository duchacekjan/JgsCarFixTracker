import {Injectable, OnDestroy} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable, Subject} from "rxjs";

export class AppTitle {
  strategy?: string
  resolver?: string

  get title(): string {
    if (this.resolver) {
      return this.resolver
    }

    return this.strategy ?? 'title';
  }

  clear() {
    this.resolver = undefined;
    this.strategy = undefined;
  }
}

@Injectable({providedIn: 'root'})
export class JgsAppTitleStrategy implements OnDestroy {
  private _title = new Subject<string>();
  private readonly currentTitle = new AppTitle()

  constructor(private readonly translate: TranslateService) {
  }

  get title(): Observable<string> {
    return this._title;
  }

  ngOnDestroy() {
    this._title.complete();
  }

  updateTitleFromStrategy(title: string) {
    this.currentTitle.strategy = title;
    this.setTitle(this.currentTitle.title);
    this.currentTitle.clear();
  }

  updateTitleFromResolver(title: string) {
    this.currentTitle.resolver = title;
    this.setTitle(this.currentTitle.title);
  }

  private setTitle(title: string) {
    setTimeout(() => {
      const finalTitle = this.translate.instant(title);
      this._title.next(finalTitle);
    }, 0);
  }

}
