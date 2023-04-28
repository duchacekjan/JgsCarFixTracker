import {Subject} from "rxjs";

export class TableConfig {
  constructor(columns: ColumnConfig[]) {
    this.columns = columns;
  }

  columns: ColumnConfig[]
  table_data_changer = new Subject<any>()
}

export class ColumnConfig {
  constructor(columnName: string, hideOnXSmall: boolean = false) {
    this.columnName = columnName;
    this.hideOnXSmall = hideOnXSmall;
  }

  columnName: string
  hideOnXSmall: boolean
}
