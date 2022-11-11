import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Fix} from "../../../models/fix";

@Component({
  selector: '[app-car-fix-item]',
  templateUrl: './car-fix-item.component.html',
  styleUrls: ['./car-fix-item.component.css']
})
export class CarFixItemComponent implements OnInit {

  @Input()
  fix: Fix = {
    mileage: 0,
    lastUpdate: new Date(),
    description: ''
  }
  @Input()
  editedIndex: number = -1;
  @Input()
  fixIndex: number = -1;
  @Output()
  editFix = new EventEmitter<Fix>()
  @Output()
  saveFix = new EventEmitter<Fix | null>()
  mileage: number = 0;
  description: string = '';
  isEdited: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editedIndex'] || changes['fixIndex']) {
      this.updateEditedProperties();
    }
  }

  onEdit() {
    this.editFix.emit(this.fix);
  }

  onRemove(){
    this.editFix.emit(this.fix);
  }

  onSave() {
    this.fix.description = this.description;
    this.fix.mileage = this.mileage;
    this.saveFix.emit(this.fix);
    this.clearEditValues();
  }

  onCancel() {
    this.clearEditValues();
    this.saveFix.emit(null);
  }

  private clearEditValues() {
    this.description = '';
    this.mileage = 0;
  }

  private updateEditedProperties() {
    if (this.editedIndex > -1 && this.fixIndex == this.editedIndex) {
      this.mileage = this.fix.mileage;
      this.description = this.fix.description;
      this.isEdited = true;
    } else {
      this.isEdited = false;
      this.clearEditValues();
    }
  }
}
