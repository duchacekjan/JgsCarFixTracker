import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Fix} from "../../../models/fix";
import {FixAction, FixActionEvent} from "../../../models/events/FixActionEvent";

@Component({
  selector: '[app-car-fix-item]',
  templateUrl: './car-fix-item.component.html',
  styleUrls: ['./car-fix-item.component.css']
})
export class CarFixItemComponent implements OnInit {

  @Input()
  fix: Fix = new Fix();
  @Input()
  editedFixId: number = -1;
  @Output()
  action = new EventEmitter<FixActionEvent>();

  mileage: number = 0;
  description: string = '';
  isEdited: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editedFixId']) {
      this.updateEditedProperties();
    }
  }

  onEdit() {
    this.invokeAction(FixAction.Edit);
  }

  onRemove() {
    this.invokeAction(FixAction.Remove);
  }

  onSave() {
    this.fix.description = this.description;
    this.fix.mileage = this.mileage;
    this.invokeAction(FixAction.Save);
    this.clearEditValues();
  }

  onCancel() {
    this.invokeAction(FixAction.Cancel);
    this.clearEditValues();
  }

  private clearEditValues() {
    this.description = '';
    this.mileage = 0;
  }

  private updateEditedProperties() {
    if (this.editedFixId === this.fix.id) {
      this.mileage = this.fix.mileage;
      this.description = this.fix.description;
      this.isEdited = true;
    } else {
      this.isEdited = false;
      this.clearEditValues();
    }
  }

  private invokeAction(action: FixAction) {
    this.action.emit({
      fix: this.fix,
      action: action
    });
  }
}
