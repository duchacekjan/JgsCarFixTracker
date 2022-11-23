import { Component, OnInit } from '@angular/core';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {Subject} from "rxjs";

@Component({
  selector: 'app-paginator-intl',
  templateUrl: 'paginator-intl.component.html'
})
export class PaginatorIntlComponent implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = `První stránka`;
  itemsPerPageLabel = '';
  lastPageLabel = `Poslední stránka`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Další stránka';
  previousPageLabel = 'Předchozí stránka';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `1 z 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `${page + 1} z ${amountPages}`;
  }
}
