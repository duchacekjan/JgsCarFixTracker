import {MatPaginatorIntl} from "@angular/material/paginator";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {inject} from "@angular/core";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

export class PaginatorTranslator implements MatPaginatorIntl {
  private readonly translate = inject(TranslateService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  private isSmall: boolean = false;

  constructor() {
    this.breakpointObserver.observe([Breakpoints.XSmall])
      .subscribe(result => {
        console.log(result)
        this.isSmall = result.matches;
        this.changes.next();
      });
  }

  changes = new Subject<void>();
  firstPageLabel = this.translate.instant('paginator.firstPageLabel');
  lastPageLabel = this.translate.instant('paginator.lastPageLabel');
  nextPageLabel = this.translate.instant('paginator.nextPageLabel');
  previousPageLabel = this.translate.instant('paginator.previousPageLabel');

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const amountPages = Math.ceil(length / pageSize);
    return this.translate.instant('paginator.pageRangeLabel_p1_p_2', {'p1': page + 1, 'p2': amountPages});
  }

  get itemsPerPageLabel(): string {
    return this.isSmall
      ? this.translate.instant('paginator.itemsPerPageLabelShort')
      : this.translate.instant('paginator.itemsPerPageLabel');
  }
}
