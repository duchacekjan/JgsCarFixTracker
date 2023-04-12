import {Component, ViewChild} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActivatedRoute} from "@angular/router";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {MenuService} from "../../../services/menu.service";
import {Observable} from "rxjs";
import {MenuItem} from "../../../models/menuItem";
import {Action} from "../../../models/action";
import {FormArray, FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {resetFormGroup} from "../../../common/jgs-common-functions";
import {MessagesService} from "../../../services/messages.service";

@Component({
  selector: 'app-menu-settings',
  templateUrl: './menu-settings.component.html',
  styleUrls: ['./menu-settings.component.scss']
})
export class MenuSettingsComponent extends AfterNavigatedHandler {
  menuItems: Observable<MenuItem[]>;
  isDrawerOpened: boolean = false;
  isNewRowBeingAdded: boolean = false;

  menuItemForm!: FormGroup;
  private existing_row_values!: any;

  @ViewChild(FormGroupDirective, {static: true}) menuFormGroup!: FormGroupDirective;

  constructor(
    private readonly menuService: MenuService,
    private readonly messageService: MessagesService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.menuItems = this.menuService.getAllItems();
    this.menuItemForm = new FormGroup({
      key: new FormControl(undefined),
      icon: new FormControl(''),
      route: new FormControl('', [Validators.required]),
      tooltip: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      allowed: new FormArray([])
    });
  }

  protected override backLinkIfNotPresent = '/';

  protected override getActionsData(): ActionsData | null {
    const addAction = new Action('add_box');
    addAction.execute = () => this.callAdd();
    addAction.tooltip = 'settings.menu.addHint';

    const result = super.getDefaultActionsData();
    result.backAction = ActionsData.createBackAction('/');
    result.actions = [addAction];
    return result;
  }

  get allowed(): FormArray {
    return this.menuItemForm.controls["allowed"] as FormArray;
  }

  get allowedControls() {
    return this.allowed.controls.map(p => p as FormControl);
  }

  addAllowed(defaultValue: string = '') {
    const allowedControl = new FormControl(defaultValue);
    this.allowed.push(allowedControl);
  }

  deleteAllowed(allowedIndex: number) {
    this.allowed.removeAt(allowedIndex);
  }

  select(row: MenuItem) {
    this.existing_row_values = {...row};
    this.showForm(row as MenuItem, false);
    this.isDrawerOpened = true;
  }

  updateTableData() {
    let menuItem = this.getItem()
    this.menuService.createOrUpdate(menuItem)
      .then(() => this.messageService.showSuccess({message: 'messages.saved'}))
      .then(() => this.callResetForm())
      .catch(err => this.messageService.showError(err));
  }

  deleteMenuItem() {
    let menuItem = this.getItem();
    this.menuService.delete(menuItem)
      .then(() => this.messageService.showSuccess({message: 'messages.deleted'}))
      .then(() => this.callResetForm())
      .catch(err => this.messageService.showError(err))
  }

  private getItem(): MenuItem {
    let updated_row_data = (this.isNewRowBeingAdded) ? {...this.menuItemForm.value} : {...this.existing_row_values, ...this.menuItemForm.value};
    return updated_row_data as MenuItem;
  }

  private callAdd() {
    let menuItem: MenuItem = {
      key: undefined,
      name: '',
      route: '',
      icon: '',
      tooltip: '',
      allowed: []
    }
    this.select(menuItem);
  }

  private showForm(menuItem: MenuItem, isNewRow: boolean) {
    this.callResetForm();
    this.menuItemForm.patchValue(menuItem);
    for (let i = 0; i < menuItem.allowed.length; i++) {
      this.addAllowed(menuItem.allowed[i]);
    }
    this.isDrawerOpened = true;
    this.isNewRowBeingAdded = isNewRow;
  }

  private callResetForm() {
    this.allowed.clear();
    resetFormGroup(this.menuFormGroup, () => this.isDrawerOpened = false);
  }
}
