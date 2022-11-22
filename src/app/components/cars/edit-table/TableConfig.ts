import {Subject} from "rxjs";

export class TableConfig {
  constructor(columns: any[]) {
    this.columns = columns;
  }

  columns!: any []
  primary_key_set: string[] = []
  table_data_changer = new Subject<any>()
  actions = new ActionsConfig()
}

export class ActionsConfig {
  add: boolean = false
  edit: boolean = false
  remove:boolean = false
}
