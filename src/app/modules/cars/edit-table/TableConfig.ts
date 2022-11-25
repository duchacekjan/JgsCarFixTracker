import {Subject} from "rxjs";

export class TableConfig {
  constructor(columns: any[]) {
    this.columns = columns;
  }

  columns!: TableColumnConfig []
  table_data_changer = new Subject<any>()
}

export class TableColumnConfig {
  key!: string;
  header!: string;
}
