import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActionsService} from "../../services/actions.service";
import {Subscription} from "rxjs";
import {SettingsService, ThemeMode} from "../../services/settings.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settingsForm = new FormGroup({
    themeMode: new FormControl(ThemeMode.Auto)
  })

  private changesSubscription = new Subscription();

  constructor(
    private actionsService: ActionsService,
    public settingsService: SettingsService) {
  }

  ngOnInit(): void {
    let control = this.settingsForm.get('themeMode');
    if (control) {
      control.patchValue(this.settingsService.themeMode);
    }
    this.changesSubscription = this.settingsForm.valueChanges
      .subscribe(formValue => {
        this.settingsService.themeMode = formValue.themeMode ?? ThemeMode.Auto;
      });

    // this.actionsService.clear();
    // this.actionsService.showBackAction();
    // this.actionsService.updateActions();
  }

  ngOnDestroy(): void {
    this.changesSubscription.unsubscribe();
  }
}
