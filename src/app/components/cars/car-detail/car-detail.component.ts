import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Car} from "../../../models/car";
import {ActivatedRoute, Router} from "@angular/router";
import {CarsService} from "../../../services/cars.service";
import {Fix} from "../../../models/fix";
import {TopBarActionsService} from "../../../services/top-bar-actions.service";
import {TopBarAction} from "../../../models/TopBarAction";
import {Subscription} from "rxjs";
import {TableConfig} from "../edit-table/TableConfig";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {TableService} from "../../../services/table.service";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit, OnDestroy {

  car: Car = new Car();
  table_config: TableConfig;
  private carKey: string | null = null;
  private queryParamSubscription: Subscription;
  private carSubscription = new Subscription();

  is_table_being_updated: boolean = false;
  is_new_row_being_added: boolean = false;
  table_update_form!: FormGroup;
  existing_row_values!: any;

  @ViewChild(FormGroupDirective, { static: true }) formGroup!: FormGroupDirective;

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private router: Router,
    private actionsService: TopBarActionsService,
    private tableService: TableService
  ) {
    this.table_config = this.createTableConfig();
    this.queryParamSubscription = route.queryParamMap.subscribe(s => this.invokeAction(s.get('action')));
    this.table_update_form = new FormGroup({
      id: new FormControl(-1),
      lastUpdate: new FormControl(new Date()),
      mileage: new FormControl('0', [Validators.required, Validators.min(0)]),
      description: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.getCar();
  }

  ngOnDestroy(): void {
    this.carSubscription.unsubscribe();
    this.queryParamSubscription.unsubscribe();
  }

  getCar(): void {
    let id = this.carKey ? this.carKey : String(this.route.snapshot.paramMap.get('id'));
    this.carSubscription = this.carsService.getCar(id)
      .subscribe(data => {
        console.log(`Car data: ${data}`)
        if (data && data.key !== undefined) {
          this.car = data;
          this.carKey = data.key ? data.key : null;
          this.updateActions(this.carKey);
          this.resetForm();
          //update the table with latest values
          this.table_config.table_data_changer.next({
            data: this.car.fixes
          });
        } else {
          this.router.navigate(['/cars']).catch();
        }
      });
  }

  private resetForm(){
    //close the drawer and reset the update form
    this.is_table_being_updated = false;
    this.table_update_form.reset();
    this.table_update_form.setErrors(null);
    this.table_update_form.updateValueAndValidity();
    this.formGroup.resetForm();
  }


  addNewRow() {
    // enabling the primary key fields
    this.tableService.toggleFormControls(this.table_update_form, ['lastUpdate'], false);
    // to reset the entire form
    this.table_update_form.reset();
    const newFix = new Fix();
    newFix.mileage = this.getNewMileage();
    this.table_update_form.patchValue(newFix);
    this.is_table_being_updated = true;
    this.is_new_row_being_added = true;
  }

  editRow(row: any) {
    this.existing_row_values = {...row};
    // to reset the entire form
    this.table_update_form.reset();
    // patch existing values in the form
    this.table_update_form.patchValue(row);
    // disabling the primary key fields
    this.tableService.toggleFormControls(this.table_update_form, ['lastUpdate'], false);
    this.is_table_being_updated = true;
    this.is_new_row_being_added = false;
  }

  removeRow(row: any) {
    this.removeFix(row as Fix);
  }

  updateTableData() {
    let updated_row_data = (this.is_new_row_being_added) ? {...this.table_update_form.value} : {...this.existing_row_values, ...this.table_update_form.value};
    let updatedFix = updated_row_data as Fix;
    this.saveFix(updatedFix);
    // this.update_table_data_sub = this.feature_module_utilities.updateTableData(updated_row_data, this.is_new_row_being_added).subscribe(
    //   (table_data)=>{
    //     //close the drawer and reset the update form
    //     this.is_table_being_updated = false;
    //     this.table_update_form.reset();
    //     //update the table with latest values
    //     this.table_config.table_data_changer.next({
    //       data: table_data,
    //       highlight: updated_row_data
    //     });
    //   },
    //   (error)=>{
    //     this.global_utilities.showSnackbar();
    //   }
    // );
  }

  private saveFix(fix: Fix | null) {

    console.log(`Save fix: ${fix?.id}`);
    if (fix) {
      fix.lastUpdate = new Date();
      if (fix.id == -1) {
        fix.id = this.getNewId();
        this.car.fixes.push(fix);
      } else {
        let existingFix = this.car.fixes.find(f => f.id == fix.id);
        if (existingFix) {
          let index = this.car.fixes.indexOf(existingFix);
          this.car.fixes[index] = fix
        }
      }
      this.updateCar();
    }
  }

  private removeFix(fix: Fix | null) {
    const index = this.car.fixes.indexOf(fix ?? new Fix());
    if (index > -1) {
      this.car.fixes.splice(index, 1);
    }

    this.updateCar();
  }

  private updateCar() {
    if (this.car.key) {
      this.carsService.update(this.car)
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

  private updateActions(id: string | null) {

    this.actionsService.clear();
    this.actionsService.showBackAction();

    if (id != null) {
      const editAction = new TopBarAction('edit_document');
      editAction.route = `/cars/detail/edit`;
      editAction.queryParams = {'id': id};
      editAction.color = 'primary';

      const removeAction = new TopBarAction('delete');
      removeAction.route = `/cars/detail/${id}`;
      removeAction.queryParams = {'action': 'delete'};
      removeAction.color = 'warn';
      this.actionsService.add(removeAction, editAction);
    }
    this.actionsService.updateActions();
  }

  private invokeAction(action: string | null) {
    if (action === 'delete') {
      this.carSubscription.unsubscribe()
      this.carsService.remove(this.car)
        .then(() => this.router.navigate(['/cars'], {replaceUrl: true}))
        .catch(() => this.getCar());
    }
  }

  private createTableConfig(): TableConfig {
    let result = new TableConfig([
      {
        key: 'lastUpdate',
        heading: 'Updated',
        isDate: true
      },
      {
        key: 'mileage',
        heading: 'Mileage (km)',
        numeric: true
      },
      {
        key: 'description',
        heading: 'Description'
      },
      {
        key: 'id',
        heading: 'Id',
        numeric: true,
        hidden: true
      }
    ]);
    result.primary_key_set = ['id'];
    result.actions.add = true;
    result.actions.edit = true;
    result.actions.remove = true;
    return result;
  }
}
