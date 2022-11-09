import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  constructor() {
  }

  ngOnInit(): void {
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
      this.saveFix.emit(fix);
    }
  }

  private getNewMileage(): number {
    let result = 0;
    if (this.fixes.length > 0) {
      result = Math.max(...this.fixes.map(({mileage}) => mileage ? mileage : 0)) + 1;
    }
    return result;
  }
}
