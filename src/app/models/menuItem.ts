import {SnapshotAction} from "@angular/fire/compat/database";

export interface MenuItem {
  key?: string,
  name: string,
  icon: string,
  route: string,
  tooltip: string,
  allowed: string[]
}

export function assignMenuItem(snapshotAction: SnapshotAction<MenuItem>): MenuItem {
  let values = {...snapshotAction.payload.val()};
  let key = snapshotAction.key ?? undefined;
  return {
    key: key,
    name: values.name ?? '',
    icon: values.icon ?? '',
    route: values.route ?? '',
    tooltip: values.tooltip ?? '',
    allowed: values.allowed ?? [],
  }
}
