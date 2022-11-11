import {Component, OnInit} from '@angular/core';
import {Car} from "../../../models/car";
import {ActivatedRoute, Router} from "@angular/router";
import {CarsService} from "../../../services/cars.service";
import {Fix} from "../../../models/fix";
import {FixAction, FixActionEvent} from "../../../models/events/FixActionEvent";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {

  car: Car = new Car();
  isNew = false;
  isEditing = false;
  editedFixId = -1;
  private carKey: string | null = null;
  private requestedEditFixId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getCar();
  }

  getCar(): void {
    const id = this.carKey ? this.carKey : String(this.route.snapshot.paramMap.get('id'));
    this.isNew = id === 'new'
    this.isEditing = this.isNew;
    if (this.isNew) {
      this.car = new Car();
    } else {
      this.carsService.getCar(id)
        .subscribe(data => {
          if (data) {
            this.car = data;
            this.carKey = data.key ? data.key : null;
            if (this.requestedEditFixId != null) {
              this.editedFixId = this.requestedEditFixId;
              this.requestedEditFixId = null;
            }
          } else {
            this.router.navigate(['/cars']).catch();
          }
        });
    }
  }

  remove() {
    this.carsService.remove(this.car).catch();
  }

  edit() {
    this.isEditing = true;
  }

  save(): void {
    if (this.car.licencePlate.length >= 7) {
      this.carsService.upsert(this.car)
        .then(key => {
          if (this.carKey === key) {
            this.getCar();
          } else {
            this.carKey = key;
            this.router.navigate([`/cars/detail/${this.carKey}`], {replaceUrl: true})
              .then(() => {
                this.getCar();
              });
          }
        })
        .catch(err => console.log(err));
    }
  }

  onFixAction(actionEvent: FixActionEvent) {
    switch (actionEvent.action) {
      case FixAction.Create:
        this.createFix();
        break;
      case FixAction.Edit:
        this.editFix(actionEvent.fix);
        break;
      case FixAction.Remove:
        this.removeFix(actionEvent.fix);
        break;
      case FixAction.Save:
        this.saveFix(actionEvent.fix);
        break;
      case FixAction.Cancel:
        this.cancelFix(actionEvent.fix);
        break;

    }
  }

  private cancelFix(fix: Fix | null) {
    if (fix?.id == -1) {
      const index = this.car.fixes.indexOf(fix)
      if (index > -1) {
        this.car.fixes.splice(index, 1);
      }
    }
    this.editedFixId = -1;
  }

  private saveFix(fix: Fix | null) {
    if (fix) {
      if (fix.id == -1) {
        fix.id = this.getNewId();
      }
      fix.lastUpdate = new Date();
      this.updateCar(-1);
    }
  }

  private removeFix(fix: Fix | null) {
    const index = this.car.fixes.indexOf(fix ?? new Fix());
    if (index > -1) {
      this.car.fixes.splice(index, 1);
    }

    this.updateCar();
  }

  private editFix(fix: Fix | null) {
    this.editedFixId = fix?.id ?? -1;
  }

  private createFix() {
    const newFix = new Fix();
    newFix.mileage = this.getNewMileage();
    this.car.fixes.push(newFix);
    this.editedFixId = newFix.id;
  }

  private updateCar(fixId: number = -1) {
    if (this.car.key) {
      this.carsService.update(this.car)
        .then(() => {
          this.requestedEditFixId = fixId;
        })
        .catch(err => console.log(err));
    }
  }

  private getNewId(): number {
    let result = 0;
    if (this.car.fixes.length > 0) {
      result = Math.max(...this.car.fixes.map(({id}) => id ? id : 0)) + 1;
    }
    return result;
  }

  private getNewMileage(): number {
    let result = 0;
    if (this.car.fixes.length > 0) {
      result = Math.max(...this.car.fixes.map(({mileage}) => mileage ? mileage : 0)) + 1;
    }
    return result;
  }
}
