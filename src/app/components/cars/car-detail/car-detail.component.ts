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
import {MessageService, MessageType} from "../../../services/message.service";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit, OnDestroy {

  car: Car = new Car();
  tableConfig: TableConfig;

  isDrawerOpened: boolean = false;
  isNewRowBeingAdded: boolean = false;
  fixItemUpdateForm!: FormGroup;
  existing_row_values!: any;

  private carKey: string | null = null;
  private queryParamSubscription: Subscription;
  private carSubscription = new Subscription();
  private updatedFixIndex: number = -1;

  @ViewChild(FormGroupDirective, {static: true}) fixFormGroup!: FormGroupDirective;

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private router: Router,
    private actionsService: TopBarActionsService,
    private tableService: TableService,
    private messageService: MessageService
  ) {
    this.tableConfig = this.createTableConfig();
    this.queryParamSubscription = route.queryParamMap.subscribe(s => this.invokeAction(s.get('action')));
    this.fixItemUpdateForm = new FormGroup({
      id: new FormControl(-1),
      lastUpdate: new FormControl(''),
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
        if (data && data.key !== undefined) {
          this.car = data;
          this.carKey = data.key ? data.key : null;
          this.updateActions(this.carKey);
          this.resetForm();
          //update the table with latest values
          this.tableConfig.table_data_changer.next({
            data: this.car.fixes,
            updatedFixIndex: this.updatedFixIndex
          });
          this.updatedFixIndex = -1;
        } else {
          this.router.navigate(['/cars']).catch();
        }
      });
  }

  addNewRow() {
    const newFix = new Fix();
    newFix.mileage = this.getNewMileage();
    this.showForm(newFix, true);
  }

  editRow(row: any) {
    this.existing_row_values = {...row};
    this.showForm(row as Fix, false);
  }

  removeRow(row: any) {
    this.removeFix(row as Fix);
  }

  updateTableData() {
    let updated_row_data = (this.isNewRowBeingAdded) ? {...this.fixItemUpdateForm.value} : {...this.existing_row_values, ...this.fixItemUpdateForm.value};
    let updatedFix = updated_row_data as Fix;
    this.saveFix(updatedFix);
  }

  private showForm(fix: Fix, isNewRow: boolean) {
    this.resetForm();
    this.fixItemUpdateForm.patchValue(fix);
    let mileage = this.fixItemUpdateForm.get('mileage')
    if (!isNewRow) {
      this.fixItemUpdateForm.get('lastUpdate')!.patchValue(this.formatDate(fix.lastUpdate));
    }
    this.tableService.toggleFormControls(this.fixItemUpdateForm, ['lastUpdate'], false);
    this.isDrawerOpened = true;
    this.isNewRowBeingAdded = isNewRow;
  }

  private resetForm() {
    //close the drawer and reset the update form
    this.isDrawerOpened = false;
    this.fixItemUpdateForm.reset();
    this.fixItemUpdateForm.setErrors(null);
    this.fixItemUpdateForm.updateValueAndValidity();
    this.fixFormGroup.resetForm();
  }

  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  private saveFix(fix: Fix | null) {
    if (fix) {
      fix.lastUpdate = new Date();
      let fixIndex = -1;
      if (fix.id == -1) {
        fix.id = this.getNewId();
        this.car.fixes.push(fix);
        fixIndex = this.car.fixes.length - 1;
      } else {
        let existingFix = this.car.fixes.find(f => f.id == fix.id);
        if (existingFix) {
          let index = this.car.fixes.indexOf(existingFix);
          fixIndex = index;
          this.car.fixes[index] = fix
        }
      }
      this.updateCar(false, fixIndex);
    }
  }

  private removeFix(fix: Fix | null) {
    const index = this.car.fixes.indexOf(fix ?? new Fix());
    if (index > -1) {
      this.car.fixes.splice(index, 1);
    }

    this.updateCar(true);
  }

  private updateCar(isDelete: boolean, fixIndex: number = -1) {
    if (this.car.key) {
      this.updatedFixIndex = fixIndex;
      this.carsService.update(this.car)
        .then(() => this.messageService.showMessage(MessageType.Success, isDelete ? 'Deleted' : 'Saved', true, 1000))
        .catch(this.messageService.showError);
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
      editAction.tooltip = 'Edit';

      const removeAction = new TopBarAction('delete');
      removeAction.route = `/cars/detail/${id}`;
      removeAction.queryParams = {'action': 'delete'};
      removeAction.color = 'warn';
      removeAction.tooltip = 'Remove';
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
    return new TableConfig([
      {
        key: 'mileage',
        header: 'Mileage (km)'
      },
      {
        key: 'description',
        header: 'Description'
      }
    ]);
  }
}
