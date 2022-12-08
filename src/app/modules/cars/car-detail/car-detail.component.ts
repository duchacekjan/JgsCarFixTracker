import {Component, OnDestroy, ViewChild} from '@angular/core';
import {Action} from "../../../models/action";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Car} from "../../../models/car";
import {TableConfig} from "../edit-table/table-config";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Fix} from "../../../models/fix";
import {MessagesService} from "../../../services/messages.service";
import {HelperService} from "../../../services/helper.service";
import {CarsService} from "../../../services/cars.service";
import {DialogData} from "../../../common/dialog/dialog.component";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent extends AfterNavigatedHandler implements OnDestroy {
  car: Car = new Car();
  readonly tableConfig: TableConfig = new TableConfig(['mileage', 'description'])

  isDrawerOpened: boolean = false;
  isNewRowBeingAdded: boolean = false;
  fixItemUpdateForm!: FormGroup;
  existing_row_values!: any;

  private carKey: string | null = null;
  //private queryParamSubscription: Subscription;
  private carSubscription: Subscription;
  private updatedFixIndex: number = -1;

  @ViewChild(FormGroupDirective, {static: true}) fixFormGroup!: FormGroupDirective;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessagesService,
    private readonly helperService: HelperService,
    private readonly carsService: CarsService,
    navigation: NavigationService) {
    super(navigation);
    this.fixItemUpdateForm = new FormGroup({
      id: new FormControl(-1),
      lastUpdate: new FormControl({value: '', disabled: true}),
      mileage: new FormControl(0, [Validators.required, Validators.min(0)]),
      description: new FormControl('', [Validators.required])
    });

    this.carSubscription = this.route.snapshot.data['car'].subscribe((car: Car) => {
        if (car?.key) {
          this.carKey = car.key!;
          this.car = car;
          this.invokeAction(this.route.snapshot.data['action']);
        } else {
          this.router.navigate(['/not-found'], {replaceUrl: true, relativeTo: this.route}).catch()
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

  protected override isMatch(data: any): boolean {
    return data?.startsWith('/cars/') === true &&
      !(data?.startsWith('/cars/edit') === true ||
        data?.startsWith('/cars/new') === true)
  }

  protected override getActionsData(data: any): ActionsData {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(`route id: ${id}`);
    const editAction = new Action('edit_document');
    editAction.route = `/cars/edit`;
    editAction.queryParams = {'id': id};
    editAction.color = 'accent';
    editAction.tooltip = 'toolbar.editCar';

    const removeAction = new Action('delete');
    removeAction.route = `/cars/${id}/delete`;
    //removeAction.queryParams = {'action': 'delete'};
    removeAction.color = 'warn';
    removeAction.tooltip = 'toolbar.removeCar';
    const result = new ActionsData();
    result.actions = [removeAction, editAction];
    result.backAction = ActionsData.createBackAction('/cars');
    return result;
  }

  private showForm(fix: Fix, isNewRow: boolean) {
    this.resetForm();
    this.fixItemUpdateForm.patchValue(fix);
    if (!isNewRow) {
      this.fixItemUpdateForm.get('lastUpdate')!.patchValue(this.formatDate(fix.lastUpdate));
    }
    this.isDrawerOpened = true;
    this.isNewRowBeingAdded = isNewRow;
  }

  private resetForm() {
    this.helperService.resetForm(this.fixItemUpdateForm, this.fixFormGroup, () => this.isDrawerOpened = false);
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

  private invokeAction(action: string | null) {
    if (action === 'delete') {
      const data = this.createDeleteDialogData('dialogs.deleteCar.title', 'dialogs.deleteCar.message');
      const dialogRef = this.messageService.showDialog(data);
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        if (result) {
          this.carsService.remove(this.car)
            .then(() => this.router.navigate(['/cars'], {replaceUrl: true, relativeTo: this.route}))
            .catch(err => this.messageService.showError(err));
        } else {
          this.router.navigate(['../'], {replaceUrl: true, relativeTo: this.route}).catch();
        }
      })
    }
  }

  private createDeleteDialogData(title: string, content: string): DialogData {
    const data = new DialogData();
    data.title = title;
    data.content = content;
    data.setOk(false);
    data.setDelete(true);
    return data;
  }
}
