import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {JgsNotification} from "../../../models/INotification";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NotificationsService} from "../../../services/notifications.service";
import {UserLocalConfigService} from "../../../services/user-local-config.service";
import {MessagesService} from "../../../services/messages.service";
import {formatDate, insertBase, resetForm} from "../../../common/jgs-common-functions";
import {SelectionModel} from "@angular/cdk/collections";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActivatedRoute} from "@angular/router";
import {ActionsData, NavigationService} from "../../../services/navigation.service";

interface ITextSelection {
  start: number
  end: number,
  insertLength: number
}

@Component({
  selector: 'app-notifications-admin',
  templateUrl: './notifications-admin.component.html',
  styleUrls: ['./notifications-admin.component.scss']
})
export class NotificationsAdminComponent extends AfterNavigatedHandler {

  body = new FormControl('', [Validators.required]);
  private subject = new FormControl('', [Validators.required]);
  private validFrom = new FormControl(<string | null>null);
  formGroup = new FormGroup({
    subject: this.subject,
    body: this.body,
    validFrom: this.validFrom
  });
  selected?: JgsNotification;
  selection = new SelectionModel<JgsNotification>(true, [], true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FormGroupDirective, {static: true}) notificationFormGroup!: FormGroupDirective;
  @ViewChild("bodyArea") bodyTextArea!: ElementRef;

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly userConfig: UserLocalConfigService,
    private readonly messageService: MessagesService,
    route: ActivatedRoute,
    navigationService: NavigationService) {
    super(route, navigationService);
    this.clearForm();
  }

  protected override backLinkIfNotPresent = ActionsData.homeRoute;

  get bodyHtml(): string {
    const matchRN = RegExp('\r\n', 'g')
    const matchN = RegExp('\n', 'g')
    return this.body.valid
      ? this.body.value!
        .replace(matchRN, '<br>')
        .replace(matchN, '<br>')
      : ''
  }

  onSubmit() {
    if (this.formGroup.valid) {
      let validFrom: Date | null = null;
      if (this.validFrom.value != null) {
        validFrom = new Date(this.validFrom.value)
      }
      if (this.selected?.data.key != undefined) {
        this.selected.data.visibleFrom = validFrom;
        this.selected.data.body = this.bodyHtml;
        this.selected.data.subject = this.subject.value!;
        this.notificationService.update(this.selected)
          .then(() => this.messageService.showSuccess({message: 'messages.notificationUpdated'}))
          .then(() => this.clearForm())
          .then(() => this.selected = undefined);
      } else {
        this.notificationService.create(
          this.subject.value!,
          this.bodyHtml,
          validFrom
        )
          .then(() => this.messageService.showSuccess({message: 'messages.notificationSend'}))
          .then(() => this.clearForm());
      }
    }
  }

  deleteSelection() {
    this.notificationService.deleteListAsync(this.selection.selected.map(m => m.data))
      .then(() => this.selection.clear());
  }

  private clearForm() {
    let data = {
      subject: '',
      body: '',
      validFrom: <string | null>null
    }
    this.formGroup.setValue(data as any);
    this.callResetForm();
  }

  private callResetForm() {
    resetForm(this.formGroup, this.notificationFormGroup);
  }

  insertUrl() {
    let tag = 'a';
    let attributes = ['href="url"'];
    let selection = this.insertBase(tag, attributes, 'link');
    this.bodyTextArea.nativeElement.selectionStart = selection.start + 9;
    this.bodyTextArea.nativeElement.selectionEnd = selection.start + 12;
  }

  insertBold() {
    let tag = 'strong';
    let selection = this.insertBase(tag);
    let tagLength = tag.length + 2;
    this.bodyTextArea.nativeElement.selectionStart = selection.start + tagLength;
    this.bodyTextArea.nativeElement.selectionEnd = selection.start + tagLength + selection.insertLength;
  }

  insertItalic() {
    let tag = 'em';
    let selection = this.insertBase(tag);
    let tagLength = tag.length + 2;
    this.bodyTextArea.nativeElement.selectionStart = selection.start + tagLength;
    this.bodyTextArea.nativeElement.selectionEnd = selection.start + tagLength + selection.insertLength;
  }

  private insertBase(tag: string, attributes: string[] = [], defaultSelection: string = ''): ITextSelection {
    let original = this.body.value;
    if (original == null) {
      return {
        start: 0,
        end: 0,
        insertLength: 0
      };
    }
    let selStart = this.bodyTextArea.nativeElement.selectionStart;
    let setEnd = this.bodyTextArea.nativeElement.selectionEnd;
    let insert = insertBase(original, selStart, setEnd, tag, defaultSelection, attributes);
    let length = insert.length - original.length;
    if (length < 0) {
      length = 0
    }
    this.body.patchValue(insert);

    this.bodyTextArea.nativeElement.focus();
    return {
      start: selStart,
      end: setEnd,
      insertLength: length
    };
  }

  onCurrentItemChanged(notification?: JgsNotification) {
    this.selected = notification
    this.clearForm();
    if (notification) {
      let data = {
        subject: notification.data.subject,
        body: this.getBody(notification),
        validFrom: formatDate(notification.data.visibleFrom)
      }
      this.formGroup.setValue(data as any);
    }
  }

  private getBody(notification: JgsNotification): string {
    const matchRN = RegExp('<br>', 'g')
    return notification.data.body
      .replace(matchRN, '\n');
  }
}
