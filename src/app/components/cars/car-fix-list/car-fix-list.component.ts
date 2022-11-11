import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Fix} from "../../../models/fix";
import {FixAction, FixActionEvent} from "../../../models/events/FixActionEvent";

@Component({
  selector: 'app-car-fix-list',
  templateUrl: './car-fix-list.component.html',
  styleUrls: ['./car-fix-list.component.css']
})
export class CarFixListComponent implements OnInit {

  @Input()
  fixes: Fix[] = []
  @Output()
  fixAction = new EventEmitter<FixActionEvent>();
  @Input()
  editedFixId = -1;

  constructor() {
  }

  ngOnInit(): void {
  }

  onAddNew() {
    this.fixAction.emit({
      fix: null,
      action: FixAction.Create
    });
  }

  onFixItemAction(actionEvent: FixActionEvent) {
    this.fixAction.emit(actionEvent);
  }
}
