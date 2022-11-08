import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Car} from "../../../models/car";

@Component({
  selector: 'app-car-list-item',
  templateUrl: './car-list-item.component.html',
  styleUrls: ['./car-list-item.component.css']
})
export class CarListItemComponent implements OnInit {

  @Input()
  car?: Car;
  @Output()
  click = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onComponentClick() {
    if (this.car) {
      this.click.emit(this.car.key);
    }
  }
}
