import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {INotification, JgsNotification} from "../../../models/INotification";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {NotificationsService} from "../../../services/notifications.service";
import {UserLocalConfigService} from "../../../services/user-local-config.service";
import {ActivatedRoute} from "@angular/router";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {MessagesService} from "../../../services/messages.service";
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-notifications-admin',
  templateUrl: './notifications-admin.component.html',
  styleUrls: ['./notifications-admin.component.scss']
})
export class NotificationsAdminComponent extends AfterNavigatedHandler implements OnInit {

  private subject = new FormControl('', [Validators.required]);
  private body = new FormControl('', [Validators.required]);
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FormGroupDirective, {static: true}) notificationFormGroup!: FormGroupDirective;

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

  protected override getActionsData(): ActionsData {
    const result = super.getActionsData();
    result.isNotificationsVisible = false;
    return result;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      let validFrom: Date | null = null;
      if (this.validFrom.value != null) {
        validFrom = new Date(this.validFrom.value)
      }
      this.notificationService.create(
        this.subject.value!,
        this.body.value!,
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
    let items = this.selection.selected.filter(item => true);
    items.forEach(item => {
      this.notificationService.delete(item.data).then();
    });
    this.selection.clear();
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
        this.dataSource.sort = this.sort;
      }
    );
  }

  private resetForm() {
    this.helperService.resetForm(this.formGroup, this.notificationFormGroup);
  }
}
