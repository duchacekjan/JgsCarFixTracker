import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {JgsNotification} from "../../../models/INotification";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {NotificationsService} from "../../../services/notifications.service";
import {UserLocalConfigService} from "../../../services/user-local-config.service";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {MessagesService} from "../../../services/messages.service";
import {HelperService} from "../../../services/helper.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {insertBase} from "../../../common/jgs-common-functions";

interface ITextSelection {
  start: number
  end: number,
  insertLength: number
}

@Component({
  selector: 'app-notifications-admin',
  templateUrl: './notifications-admin.component.html',
  styleUrls: ['./notifications-admin.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class NotificationsAdminComponent extends AfterNavigatedHandler implements OnInit {

  body = new FormControl('', [Validators.required]);
  private subject = new FormControl('', [Validators.required]);
  private validFrom = new FormControl(<string | null>null);
  formGroup = new FormGroup({
    subject: this.subject,
    body: this.body,
    validFrom: this.validFrom
  });
  displayedColumns: string[] = ['select', 'subject', 'created'];
  dataSource: MatTableDataSource<JgsNotification> = new MatTableDataSource<JgsNotification>([]);
  pageOptions = [5, 10, 20, 50];
  pageSize = 10;
  selection = new SelectionModel<JgsNotification>(true, []);
  selected?: JgsNotification;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FormGroupDirective, {static: true}) notificationFormGroup!: FormGroupDirective;
  @ViewChild("bodyArea") bodyTextArea!: ElementRef;

  private pageSizeKey = 'notifications.pageSize';
  private notificationsSubscription = new Subscription();

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly userConfig: UserLocalConfigService,
    private readonly messageService: MessagesService,
    private readonly helperService: HelperService,
    route: ActivatedRoute,
    navigationService: NavigationService) {
    super(route, navigationService);
    this.clearForm();
  }

  get bodyHtml(): string {
    return this.body.valid
      ? this.body.value!
        .replace('\r\n', '</br>')
        .replace('\n', '</br>')
      : ''
  }

  ngOnInit(): void {
    this.userConfig.load(this.pageSizeKey)
      .then(currentPageSize => {
        setTimeout(() => {
          if (currentPageSize != null) {
            this.pageSize = <number>JSON.parse(currentPageSize);
          }
        }, 0);
      });
    this.trackDataChange();
  }

  ngOnDestroy(): void {
    this.notificationsSubscription.unsubscribe();
  }

  protected override backLinkIfNotPresent = '/';

  onSubmit() {
    if (this.formGroup.valid) {
      let validFrom: Date | null = null;
      if (this.validFrom.value != null) {
        validFrom = new Date(this.validFrom.value)
      }
      this.notificationService.create(
        this.subject.value!,
        this.bodyHtml,
        validFrom
      )
        .then(() => this.messageService.showSuccess({message: 'messages.notificationSend'}))
        .then(() => this.clearForm());
    }
  }

  handlePageEvent($event: PageEvent) {
    this.userConfig.save(this.pageSizeKey, JSON.stringify($event.pageSize));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: JgsNotification): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${1}`;
  }

  deleteSelection() {
    this.notificationService.deleteListAsync(this.selection.selected.map(m => m.data))
      .then(() => this.selection.clear());
  }

  setCurrentNotification(notification: JgsNotification) {
    if (this.selected?.data.key == notification.data.key) {
      this.selected = undefined;
    } else {
      this.selected = notification
    }
  }

  private clearForm() {
    let data = {
      subject: '',
      body: '',
      validFrom: <string | null>null
    }
    this.formGroup.setValue(data as any);
    this.resetForm();
  }

  private trackDataChange() {
    this.notificationsSubscription.unsubscribe();
    this.dataSource = new MatTableDataSource<JgsNotification>([]);
    this.notificationsSubscription = this.notificationService.getList(undefined, true).subscribe(
      (new_data: JgsNotification[]) => {
        this.dataSource = new MatTableDataSource<JgsNotification>(new_data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'created':
              return item.data.created.valueOf();
            case 'subject':
              return item.data.subject;
            default:
              return item.toString();
          }
        };
        this.dataSource.sort = this.sort;
      }
    );
  }

  private resetForm() {
    this.helperService.resetForm(this.formGroup, this.notificationFormGroup);
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
}
