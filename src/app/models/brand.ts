import {Model} from "./model";

export interface Brand {
  key?: string
  name: string,
  searchName: string,
  models: Model[]
}
