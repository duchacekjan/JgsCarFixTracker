import {Subject} from "rxjs";

export class TableConfig {
  constructor(columns: string[]) {
    this.columns = columns;
  }

  columns: string[]
  table_data_changer = new Subject<any>()
}
