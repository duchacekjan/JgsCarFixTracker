import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Fix} from "../../../models/fix";

@Component({
  selector: 'app-car-fix-list',
  templateUrl: './car-fix-list.component.html',
  styleUrls: ['./car-fix-list.component.css']
})
export class CarFixListComponent implements OnInit {

  @Input()
  fixes: Fix[] = []
  @Output()
  saveFix = new EventEmitter<Fix>();
  @Output()
  editFix = new EventEmitter<number>();

  @Input()
  editedIndex = -1;

  mileage: number = 0;
  description: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editedIndex']) {
      this.updateEditedProperties();
    }
  }

  onAddNew() {
    const newFix = new Fix();
    newFix.mileage = this.getNewMileage();
    this.saveFix.emit(newFix);
  }

  onEditFix(index: number) {
    this.editFix.emit(index);
  }

  onSaveFix() {
    if (this.editedIndex > -1) {
      const fix = this.fixes[this.editedIndex];
      fix.description = this.description;
      fix.mileage = this.mileage;
      this.saveFix.emit(fix);
    }
  }

  onCancelFix() {
    this.editFix.emit(-1);
  }

  private getNewMileage(): number {
    let result = 0;
    if (this.fixes.length > 0) {
      result = Math.max(...this.fixes.map(({mileage}) => mileage ? mileage : 0)) + 1;
    }
    return result;
  }

  private updateEditedProperties() {
    if (this.editedIndex > -1) {
      const fix = this.fixes[this.editedIndex];
      this.mileage = fix.mileage;
      this.description = fix.description;
    } else {
      this.mileage = 0;
      this.description = '';
    }
  }
}
