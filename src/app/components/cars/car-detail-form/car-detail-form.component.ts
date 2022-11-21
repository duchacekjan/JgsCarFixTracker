import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CarsService} from "../../../services/cars.service";
import {TopBarActionsService} from "../../../services/top-bar-actions.service";
import {TopBarAction} from "../../../models/TopBarAction";

@Component({
  selector: 'app-car-detail-form',
  templateUrl: './car-detail-form.component.html',
  styleUrls: ['./car-detail-form.component.css']
})
export class CarDetailFormComponent implements OnInit {

  isNew = false;

  constructor(private route: ActivatedRoute, private carsService: CarsService, private router: Router, private actionsService: TopBarActionsService) {
  }

  ngOnInit(): void {
    this.getCar();
  }

  getCar(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.isNew = id === null;
    this.carsService.getCar(id ?? 'new')
      .subscribe(data => {
        if (data && data.key !== undefined) {
          this.updateActions();
        } else {
          this.router.navigate(['/cars']).catch();
        }
      });
  }

  private updateActions() {
    this.actionsService.clear();
    this.actionsService.showBackAction();
    this.actionsService.updateActions();
  }
}
