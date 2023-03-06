import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {map, Observable, of, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {SettingsService, ThemeMode} from "../../../services/settings.service";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {Brand} from "../../../models/brand";
import {BrandsService} from "../../../services/brands.service";
import {search, searchText} from "../../../common/jgs-common-functions";
import {Model} from "../../../models/model";
import {MessagesService} from "../../../services/messages.service";

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent extends AfterNavigatedHandler implements OnInit, OnDestroy {

  themeMode = new FormControl(ThemeMode.Auto);
  brandSearchText = new FormControl();
  modelSearchText = new FormControl();
  brandOptions: Observable<Brand[]> = of([]);
  modelOptions: Observable<Model[]> = of([]);
  brandActions = {
    'edit': false,
    'new': false,
    'delete': false
  }

  modelActions = {
    'edit': false,
    'new': false,
    'delete': false
  }
  private _selectedBrand?: Brand;
  private _selectedModel?: Model;

  private changesSubscription: Subscription;
  private brandsSubscription: Subscription;

  private brands: Brand[] = [];
  private _isBrandInEditMode: boolean = false;
  private _isModelInEditMode: boolean = false;

  @ViewChild("brandInput") brandInput!: ElementRef;
  @ViewChild("modelInput") modelInput!: ElementRef;

  constructor(
    public readonly settingsService: SettingsService,
    private readonly brandsService: BrandsService,
    private readonly messageService: MessagesService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.changesSubscription = this.themeMode.valueChanges
      .subscribe(themeModeValue => {
        this.settingsService.themeMode = themeModeValue ?? ThemeMode.Auto;
      });
    this.brandsSubscription = this.brandsService.getList()
      .subscribe(brands => {
        this.brands = brands;
        this.reassign();
      })
  }

  protected override backLinkIfNotPresent = '/';

  protected override getActionsData(): ActionsData {
    const result = super.getActionsData();
    result.isSettingsVisible = false;
    return result;
  }

  ngOnInit(): void {
    this.themeMode.patchValue(this.settingsService.themeMode);
    this.brandOptions = this.brandSearchText.valueChanges.pipe(
      search(),
      map((searchQuery: string) => this.searchBrands(searchQuery || '')));
    this.modelOptions = this.modelSearchText.valueChanges.pipe(
      search(),
      map((searchQuery: string) => this.searchModels(searchQuery || '')));
  }

  ngOnDestroy(): void {
    this.changesSubscription.unsubscribe();
    this.brandsSubscription.unsubscribe();
  }

  get isBrandInEditMode() {
    return this._isBrandInEditMode;
  }

  set isBrandInEditMode(value: boolean) {
    this._isBrandInEditMode = value;
    if (value) {
      this.modelSearchText.disable();
    } else {
      this.modelSearchText.enable();
    }
    this.updateActions();
  }

  get selectedBrand() {
    return this._selectedBrand;
  }

  private set selectedBrand(value) {
    this._selectedBrand = value;
    if (!value) {
      this.selectedModel = undefined;
      this.modelSearchText.setValue('');
      this.modelSearchText.disable()
    } else {
      this.modelSearchText.enable()
      this.updateActions();
    }
  }

  get selectedModel() {
    return this._selectedModel;
  }

  private set selectedModel(value) {
    this._selectedModel = value;
    this.updateActions();
  }

  addBrand() {
    let searchText = this.brandSearchText.value;
    if (!searchText || searchText.length == 0) {
      this.messageService.showError({message: 'validations.brandRequired'})
      return;
    }
    let brand = <Brand>{
      name: searchText,
      models: []
    }
    this.brandsService.upsertBrand(brand)
      .then(() => this.selectedBrand = brand)
      .then(() => this.messageService.showSuccess({message: 'messages.carBrandCreated'}))
      .then(() => this.reassign())
      .catch(err => this.messageService.showError(err));
  }

  removeBrand() {
    if (this.selectedBrand) {
      this.brandsService.remove(this.selectedBrand)
        .then(() => this.brandSearchText.setValue(''))
        .then(() => this.messageService.showSuccess({message: 'messages.carBrandDeleted'}));
    }
  }

  editBrand() {
    this.brandInput.nativeElement.focus();
    this.isBrandInEditMode = true;
  }

  saveBrand(save: boolean) {
    if (save && this.selectedBrand) {
      let newName = this.brandSearchText.value;
      console.log(newName);
      if (newName) {
        this.selectedBrand.name = newName;
        this.brandsService.upsertBrand(this.selectedBrand)
          .then(() => this.isBrandInEditMode = false)
          .then(() => this.reassign())
          .then(() => this.messageService.showSuccess({message: 'messages.carBrandEdited'}));
      } else {
        this.isBrandInEditMode = false;
      }
    } else {
      this.isBrandInEditMode = false;
    }
  }

  onBrandSelected($event: any) {
    this.selectedBrand = $event.option.value;
  }

  clearBrandText() {
    this.selectedBrand = undefined;
    this.brandSearchText.setValue('');
  }

  brandDisplayFunction(option: any) {
    if (option == null) {
      return null;
    }

    let brand = option as Brand;
    if (brand) {
      return brand.name;
    }
    return option;
  };

  get isModelInEditMode() {
    return this._isModelInEditMode;
  }

  set isModelInEditMode(value: boolean) {
    this._isModelInEditMode = value;
    if (value) {
      this.brandSearchText.disable();
    } else {
      this.brandSearchText.enable();
    }
    this.updateActions();
  }

  addModel() {
    let searchText = this.modelSearchText.value;
    if (!searchText || searchText.length == 0 || !this.selectedBrand) {
      return;
    }
    let model = <Model>{
      id: this.getNewId(this.selectedBrand.models),
      name: searchText
    }
    if (!this.selectedBrand.models) {
      this.selectedBrand.models = [];
    }
    this.selectedBrand.models.push(model);

    this.brandsService.upsertBrand(this.selectedBrand)
      .then(() => this.selectedModel = model)
      .then(() => this.messageService.showSuccess({message: 'messages.carModelCreated'}))
      .then(() => this.reassign());
  }

  editModel() {
    this.modelInput.nativeElement.focus();
    this.isModelInEditMode = true;
  }

  saveModel(save: boolean) {
    if (save && this.selectedModel && this.selectedBrand) {
      let newName = this.modelSearchText.value;
      if (newName) {
        this.selectedModel.name = newName;
        this.brandsService.upsertBrand(this.selectedBrand)
          .then(() => this.isModelInEditMode = false)
          .then(() => this.messageService.showSuccess({message: 'messages.carModelEdited'}))
          .then(() => this.reassign());
      } else {
        this.isModelInEditMode = false;
      }
    } else {
      this.isModelInEditMode = false;
    }
  }

  removeModel() {
    if (this.selectedModel && this.selectedBrand?.models) {
      let index = this.selectedBrand.models.indexOf(this.selectedModel);
      if (index < 0) {
        return;
      }
      this.selectedBrand.models.splice(index, 1);
      this.brandsService.upsertBrand(this.selectedBrand)
        .then(() => this.modelSearchText.setValue(''))
        .then(() => this.messageService.showSuccess({message: 'messages.carModelRemoved'}));
    }
  }

  onModelSelected($event: any) {
    this.selectedModel = $event.option.value;
  }

  clearModelText() {
    this.selectedModel = undefined;
    this.modelSearchText.setValue('');
  }

  modelDisplayFunction(option: any) {
    if (option == null) {
      return null;
    }

    let model = option as Model;
    if (model) {
      return model.name;
    }
    return option;
  };

  private reassign() {
    if (this.selectedBrand) {
      this.selectedBrand = this.brands.find(f => f.name == this.selectedBrand?.name);
      if (this.selectedModel) {
        this.selectedModel = this.selectedBrand?.models?.find(f => f.name == this.selectedModel?.name)
      }
    } else {
      this.selectedModel = undefined;
    }
  }

  private searchBrands(searchedText: string): Brand[] {
    if (this.isBrandInEditMode) {
      return [];
    }
    this.selectedBrand = undefined;

    if (searchedText.length == 0) {
      return [];
    }
    return this.brands.filter(brand => searchText(brand.name, searchedText));
  }

  private searchModels(searchedText: string): Model[] {
    if (this.isModelInEditMode) {
      return [];
    }
    this.selectedModel = undefined;
    if (searchedText.length == 0 || !this.selectedBrand) {
      return [];
    }
    let models = this.selectedBrand.models ?? [];
    return models.filter(model => searchText(model.name, searchedText));
  }

  private getNewId(models?: Model[]): number {
    let result = 0;
    if (models && models.length > 0) {
      result = Math.max(...models.map(({id}) => id ? id : 0)) + 1;
    }
    return result;
  }

  private updateActions() {
    let brandName = this.brandSearchText.value;
    let brandNameInvalid = !brandName || brandName.length == 0;
    this.brandActions = {
      'edit': this.isModelInEditMode || !this.selectedBrand,

      'new': this.isModelInEditMode || this.selectedBrand != undefined || brandNameInvalid,

      'delete': this.isModelInEditMode || !this.selectedBrand
    }
    let baseModelState = this.isBrandInEditMode || !this.selectedBrand;
    let modelName = this.brandSearchText.value;
    let modelNameInvalid = !modelName || modelName.length == 0;
    this.modelActions = {
      'edit': baseModelState || !this.selectedModel,

      'new': baseModelState || this.selectedModel != undefined || modelNameInvalid,

      'delete': baseModelState || !this.selectedModel
    }
  }
}
