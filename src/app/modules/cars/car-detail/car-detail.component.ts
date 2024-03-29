import {Component, OnDestroy, ViewChild} from '@angular/core';
import {Action} from "../../../models/action";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";
import {Car} from "../../../models/car";
import {ColumnConfig, TableConfig} from "../edit-table/table-config";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Fix} from "../../../models/fix";
import {MessagesService} from "../../../services/messages.service";
import {CarsService} from "../../../services/cars.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {DialogData} from "../../../common/dialog/dialog.model";
import {formatDate, resetForm} from "../../../common/jgs-common-functions";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent extends AfterNavigatedHandler implements OnDestroy {
  car: Car = new Car();
  readonly tableConfig: TableConfig = new TableConfig([
    new ColumnConfig('date', true),
    new ColumnConfig('mileage'),
    new ColumnConfig('description')])

  isDrawerOpened: boolean = false;
  isNewRowBeingAdded: boolean = false;
  fixItemUpdateForm!: FormGroup;
  existing_row_values!: any;

  private carKey: string | null = null;
  //private queryParamSubscription: Subscription;
  private carSubscription: Subscription;
  private updatedFixIndex: number = -1;
  private carDeleted: boolean = false;

  @ViewChild(FormGroupDirective, {static: true}) fixFormGroup!: FormGroupDirective;

  constructor(
    route: ActivatedRoute,
    private readonly messageService: MessagesService,
    public readonly carsService: CarsService,
    navigation: NavigationService) {
    super(route, navigation);
    this.fixItemUpdateForm = new FormGroup({
      id: new FormControl(-1),
      lastUpdate: new FormControl({value: '', disabled: true}),
      mileage: new FormControl(0, [Validators.required, Validators.min(0)]),
      description: new FormControl('', [Validators.required])
    });

    this.carSubscription = this.getRouteData('car').subscribe((car: Car) => {
        if (car?.key) {
          this.carKey = car.key!;
          this.car = car;
          this.callResetForm();
          //update the table with latest values
          this.tableConfig.table_data_changer.next({
            data: this.car.fixes,
            updatedFixIndex: this.updatedFixIndex
          });
          this.updatedFixIndex = -1;
        } else {
          if (!this.carDeleted) {
            this.messageService.showError({message: 'cars.detail.notFound'});
          }
          this.router.navigate(['/cars'], {replaceUrl: true, relativeTo: this.route}).catch();
        }
      }
    );
  }

  ngOnDestroy() {
    this.carSubscription.unsubscribe();
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
    const data = this.createDeleteDialogData('dialogs.deleteFix.title', 'dialogs.deleteFix.message');
    const dlgRef = this.messageService.showDialog(data);
    dlgRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeFix(row as Fix);
      }
    })
  }

  updateTableData() {
    let updated_row_data = (this.isNewRowBeingAdded) ? {...this.fixItemUpdateForm.value} : {...this.existing_row_values, ...this.fixItemUpdateForm.value};
    let updatedFix = updated_row_data as Fix;
    this.saveFix(updatedFix);
  }

  protected override getActionsData(): ActionsData | null {
    const id = this.getRouteParam('id');
    const editAction = new Action('edit_document');
    editAction.route = `/cars/${id}/edit`;
    editAction.color = 'accent';
    editAction.tooltip = 'cars.detail.edit.actionHint';

    const removeAction = new Action('delete');
    removeAction.execute = () => this.callDelete();
    removeAction.color = 'warn';
    removeAction.tooltip = 'cars.detail.remove.actionHint';
    const result = super.getDefaultActionsData();
    result.actions = [removeAction, editAction];
    return result;
  }

  private callDelete() {
    const data = this.createDeleteDialogData('dialogs.deleteCar.title', 'dialogs.deleteCar.message');
    const dialogRef = this.messageService.showDialog(data);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carDeleted = true;
        this.carsService.remove(this.car)
          .then(() => this.carDeleted = false)
          .then(() => this.router.navigate(['/cars'], {replaceUrl: true, relativeTo: this.route}))
          .catch(err => this.messageService.showError(err));
      } else {
        this.router.navigate(['../'], {replaceUrl: true, relativeTo: this.route}).catch();
      }
    })
  }

  private showForm(fix: Fix, isNewRow: boolean) {
    this.callResetForm();
    this.fixItemUpdateForm.patchValue(fix);
    if (!isNewRow) {
      this.fixItemUpdateForm.get('lastUpdate')!.patchValue(formatDate(fix.lastUpdate));
    }
    this.isDrawerOpened = true;
    this.isNewRowBeingAdded = isNewRow;
  }

  private callResetForm() {
    resetForm(this.fixItemUpdateForm, this.fixFormGroup, () => this.isDrawerOpened = false);
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
        .then(() => this.messageService.showSuccess({message: isDelete ? 'messages.deleted' : 'messages.saved'}))
        .catch(err => this.messageService.showError(err));
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

  private createDeleteDialogData(title: string, content: string): DialogData {
    return {
      title: title,
      content: content,
      actions: [
        {
          label: 'buttons.cancel',
          getValue(_: any): any {
            return false;
          }
        },
        {
          label: 'buttons.delete',
          color: 'warn',
          getValue(_: any): any {
            return true;
          }
        }
      ]
    };
  }
}
