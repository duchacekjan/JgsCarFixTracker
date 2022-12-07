import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {SettingsService, ThemeMode} from "../../services/settings.service";
import {BaseAfterNavigatedHandler} from "../../common/BaseAfterNavigatedHandler";
import {ActionsData, NavigationService} from "../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-detail',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseAfterNavigatedHandler implements OnInit, OnDestroy {

  settingsForm = new FormGroup({
    themeMode: new FormControl(ThemeMode.Auto)
  })

  private changesSubscription: Subscription;
  private backLink = '';

  constructor(
    public readonly settingsService: SettingsService,
    private readonly route: ActivatedRoute,
    navigation: NavigationService) {
    super(navigation);
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
    this.backLink = this.route.snapshot.data['back-link'];
  }

  ngOnDestroy(): void {
    this.changesSubscription.unsubscribe();
  }

  protected override isMatch(data: any): boolean {
    return data === '/settings'
  }

  protected override getActionsData(data: any): ActionsData {
    const result = new ActionsData();
    result.isSettingsVisible = false;
    result.backAction = ActionsData.createBackAction(this.backLink);
    return result;
  }
}
