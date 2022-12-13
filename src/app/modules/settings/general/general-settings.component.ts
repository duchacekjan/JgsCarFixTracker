import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {SettingsService, ThemeMode} from "../../../services/settings.service";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent extends AfterNavigatedHandler implements OnInit, OnDestroy {

  settingsForm = new FormGroup({
    themeMode: new FormControl(ThemeMode.Auto)
  })

  private changesSubscription: Subscription;

  constructor(
    public readonly settingsService: SettingsService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.changesSubscription = this.settingsForm.valueChanges
      .subscribe(formValue => {
        this.settingsService.themeMode = formValue.themeMode ?? ThemeMode.Auto;
      });
  }

  ngOnInit(): void {
    let control = this.settingsForm.get('themeMode');
    if (control) {
      control.patchValue(this.settingsService.themeMode);
    }
  }

  ngOnDestroy(): void {
    this.changesSubscription.unsubscribe();
  }

  protected override getActionsData(): ActionsData {
    const result = super.getActionsData();
    result.isSettingsVisible = false;
    return result;
  }
}
