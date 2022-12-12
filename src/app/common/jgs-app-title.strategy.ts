import {Injectable, OnDestroy} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class JgsAppTitleStrategy implements OnDestroy {
  private _title = new Subject<string>();

  constructor(private readonly translate: TranslateService) {
  }

  get title(): Observable<string> {
    return this._title;
  }

  ngOnDestroy() {
    this._title.complete();
  }

  updateTitle(title?: string) {
    setTimeout(() => {
      const finalTitle = this.translate.instant(title ?? 'title');
      this._title.next(finalTitle);
    }, 0)

  }
}
