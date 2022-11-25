import {MatPaginatorIntl} from "@angular/material/paginator";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {inject} from "@angular/core";

export class PaginatorIntlComponent implements MatPaginatorIntl {
  private translate = inject(TranslateService)
  changes = new Subject<void>();

  firstPageLabel = this.translate.instant('paginator.firstPageLabel');
  itemsPerPageLabel = this.translate.instant('paginator.itemsPerPageLabel');
  lastPageLabel = this.translate.instant('paginator.lastPageLabel');
  nextPageLabel = this.translate.instant('paginator.nextPageLabel');
  previousPageLabel = this.translate.instant('paginator.previousPageLabel');

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const amountPages = Math.ceil(length / pageSize);
    return this.translate.instant('paginator.pageRangeLabel_p1_p_2', {'p1': page + 1, 'p2': amountPages});
  }
}
