import {Fix} from "../fix";

export class FixActionEvent {
  fix: Fix | null = null;
  action: FixAction = FixAction.None;
}

export enum FixAction {
  None,
  Create,
  Edit,
  Remove,
  Save,
  Cancel
}
