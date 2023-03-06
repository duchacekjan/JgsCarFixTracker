import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {CarsService} from "../../../services/cars.service";
import {Car} from "../../../models/car";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Observable, of, Subscription} from "rxjs";
import {MessagesService} from "../../../services/messages.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {CommonValidators} from "../../../common/validators/common.validators";
import {Fix} from "../../../models/fix";
import {BrandsService} from "../../../services/brands.service";
import {Brand} from "../../../models/brand";
import {search, searchText} from "../../../common/jgs-common-functions";
import {Model} from "../../../models/model";

@Component({
  selector: 'app-car-detail-form',
  templateUrl: './car-detail-form.component.html',
  styleUrls: ['./car-detail-form.component.scss']
})
export class CarDetailFormComponent extends AfterNavigatedHandler implements OnInit, OnDestroy {
  isNew = false;

  licencePlate = new FormControl('', {updateOn: 'blur'});
  brand = new FormControl('');
  model = new FormControl('');
  fixes = new FormControl(<Fix[]>[]);
  key = new FormControl('');
  stk = new FormControl(<string | null>null);
  carForm = new FormGroup({
    licencePlate: this.licencePlate,
    brand: this.brand,
    model: this.model,
    fixes: this.fixes,
    key: this.key,
    stk: this.stk
  });

  brandActions = {
    'edit': false,
    'new': false,
    'delete': false
  };

  modelActions = {
    'edit': false,
    'new': false,
    'delete': false
  };
  brandOptions: Observable<Brand[]> = of([]);
  modelOptions: Observable<Model[]> = of([]);

  private _selectedBrand?: Brand;
  private _selectedModel?: Model;
  private brands: Brand[] = [];
  private _isBrandInEditMode: boolean = false;
  private _isModelInEditMode: boolean = false;
  private dataLoaded: boolean = false;

  private carSubscription = new Subscription();
  private brandsSubscription: Subscription;

  constructor(
    private carsService: CarsService,
    route: ActivatedRoute,
    private router: Router,
    private messageService: MessagesService,
    private brandsService: BrandsService,
    navigation: NavigationService) {
    super(route, navigation);
    this.brandsSubscription = this.brandsService.getList()
      .subscribe(data => {
        this.brands = data;
        this.dataLoaded = true;
        this.selectBrandAndModel();
      })
  }

  protected override readonly backLinkIfNotPresent: string = '/cars';

  get isModelInEditMode() {
    return this._isModelInEditMode;
  }

  set isModelInEditMode(value: boolean) {
    this._isModelInEditMode = value;
    if (value) {
      this.brand.disable();
    } else {
      this.brand.enable();
    }
    this.updateActions();
  }

  get isBrandInEditMode() {
    return this._isBrandInEditMode;
  }

  set isBrandInEditMode(value: boolean) {
    this._isBrandInEditMode = value;
    if (value) {
      this.model.disable();
    } else {
      this.model.enable();
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
      this.model.setValue('');
    } else {
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

  ngOnInit() {
    this.brandOptions = this.brand.valueChanges.pipe(
      search(),
      map((searchQuery: string) => this.searchBrands(searchQuery || '')));
    this.modelOptions = this.model.valueChanges.pipe(
      search(),
      map((searchQuery: string) => this.searchModels(searchQuery || '')));

    this.isNew = this.route.snapshot.data['is-new'];

    if (this.isNew) {
      this.licencePlate.clearValidators();
      this.licencePlate.addValidators([Validators.required, Validators.minLength(7), Validators.maxLength(8)]);
      this.licencePlate.addAsyncValidators([CommonValidators.uniqueLicencePlate(this.carsService)]);
    }

    this.carSubscription = this.route.snapshot.data['car'].subscribe((data: Car) => {
      if (data && data.key !== undefined) {
        if (data.stk === undefined) {
          data.stk = null;
        }
        this.carForm.setValue(data as any);
        this.selectBrandAndModel();
      } else {
        this.messageService.showError({message: this.isNew ? 'cars.detail.errorCreate' : 'cars.detail.notFound'});
        this.router.navigate(['/cars']).catch();
      }
    });
  }

  ngOnDestroy() {
    this.carSubscription.unsubscribe();
    this.brandsSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.carForm.valid) {
      let car = (this.carForm.value as any) as Car;
      if (car && car.licencePlate) {
        let brand = <Brand>(this.brand.value as any);
        if (brand) {
          car.brand = brand.name;
        }
        let model = <Model>(this.model.value as any);
        if (model) {
          car.model = model.name;
        }
        this.carsService.upsert(car)
          .then(id => {
            this.messageService.showSuccess({message: 'messages.saved'});
            this.router.navigate([`/cars/${id}`]).catch();
          })
          .catch(err => this.messageService.showError(err));
      }
    }
  }

  addBrand() {
    let searchText = this.brand.value;
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
      .then(() => this.reassign());
  }

  removeBrand() {
    if (this.selectedBrand) {
      this.brandsService.remove(this.selectedBrand)
        .then(() => this.brand.setValue(''));
    }
  }

  editBrand() {
    this.isBrandInEditMode = true;
  }

  saveBrand(save: boolean) {
    if (save && this.selectedBrand) {
      let newName = this.brand.value;
      if (newName) {
        this.selectedBrand.name = newName;
        this.brandsService.upsertBrand(this.selectedBrand)
          .then(() => this.isBrandInEditMode = false)
          .then(() => this.reassign());
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
    this.brand.setValue('');
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

  addModel() {
    let searchText = this.model.value;
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
      .then(() => this.reassign());
  }

  editModel() {
    this.isModelInEditMode = true;
  }

  saveModel(save: boolean) {
    if (save && this.selectedModel && this.selectedBrand) {
      let newName = this.model.value;
      if (newName) {
        this.selectedModel.name = newName;
        this.brandsService.upsertBrand(this.selectedBrand)
          .then(() => this.isModelInEditMode = false)
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
        .then(() => this.model.setValue(''));
    }
  }

  onModelSelected($event: any) {
    this.selectedModel = $event.option.value;
  }

  clearModelText() {
    this.selectedModel = undefined;
    this.model.setValue('');
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

  private getNewId(models?: Model[]): number {
    let result = 0;
    if (models && models.length > 0) {
      result = Math.max(...models.map(({id}) => id ? id : 0)) + 1;
    }
    return result;
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

  private updateActions() {
    let brandName = this.brand.value;
    let brandNameInvalid = !brandName || brandName.length == 0;
    this.brandActions = {
      'edit': this.isModelInEditMode || !this.selectedBrand,

      'new': this.isModelInEditMode || this.selectedBrand != undefined || brandNameInvalid,

      'delete': this.isModelInEditMode || !this.selectedBrand
    }
    let baseModelState = this.isBrandInEditMode || !this.selectedBrand;
    let modelName = this.brand.value;
    let modelNameInvalid = !modelName || modelName.length == 0;
    this.modelActions = {
      'edit': baseModelState || !this.selectedModel,

      'new': baseModelState || this.selectedModel != undefined || modelNameInvalid,

      'delete': baseModelState || !this.selectedModel
    }
  }

  private selectBrandAndModel() {
    if (!this.dataLoaded) {
      return;
    }

    let brandName = this.brand.value;
    let modelName = this.model.value;

    if (brandName != null && brandName.length > 0) {
      this.selectedBrand = this.searchBrands(brandName).find(() => true);
      if(this.selectedBrand != undefined){
        this.brand.setValue(this.selectedBrand as any);
      }
    }

    if (!this.selectedBrand) {
      return;
    }

    if (modelName != null && modelName.length > 0) {
      this.selectedModel = this.searchModels(modelName).find(() => true);
      if(this.selectedModel != undefined){
        this.model.setValue(this.selectedModel as any);
      }
    }
  }
}
