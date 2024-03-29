import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActivatedRoute} from "@angular/router";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {AuthService} from "../../../services/auth.service";
import {Subscription} from "rxjs";
import {JgsNotification} from "../../../models/INotification";
import {NotificationsService} from "../../../services/notifications.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {UserLocalConfigService} from "../../../services/user-local-config.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MessagesService} from "../../../services/messages.service";

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent extends AfterNavigatedHandler implements OnDestroy, OnInit {
  displayedColumns: string[] = ['select', 'subject', 'created'];
  dataSource: MatTableDataSource<JgsNotification> = new MatTableDataSource<JgsNotification>([]);
  pageOptions = [5, 10, 20, 50];
  pageSize = 10;
  selection = new SelectionModel<JgsNotification>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private userId?: string;
  private pageSizeKey = 'notifications.pageSize';
  private notificationsSubscription = new Subscription();
  private _selected?: JgsNotification;

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationsService,
    private readonly userConfig: UserLocalConfigService,
    private readonly messageService: MessagesService,
    route: ActivatedRoute,
    navigationService: NavigationService) {
    super(route, navigationService);
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

  protected override getActionsData(): ActionsData | null {
    const result = super.getDefaultActionsData();
    result.isNotificationsVisible = false;
    return result;
  }

  protected override afterNavigationEnded() {
    this.authService.getCurrentUser()
      .then(user => this.setUserId(user?.uid));
  }

  get selected(): JgsNotification | undefined {
    return this._selected;
  }

  private set selected(value: JgsNotification | undefined) {
    this._selected = value;
    if (this._selected != undefined && !this._selected.isRead) {
      this.notificationService.setAsRead(this._selected.data, this.userId).then();
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


  onCurrentItemChanged(notification?: JgsNotification) {
    this.selected = notification;
  }

  deleteSelection() {
    this.notificationService.markAllAsDeletedAsync(this.selection.selected.map(m => m.data), this.userId)
      .then(() => this.selection.clear());
  }

  markAllAsRead() {
    this.notificationService.markAllAsReadAsync(this.selection.selected.map(m => m.data), this.userId)
      .then(() => this.selection.clear());
  }

  private setUserId(userId?: string) {
    this.userId = userId;
    setTimeout(() => {
      this.trackDataChange();
    }, 0);
  }

  private trackDataChange() {
    this.notificationsSubscription.unsubscribe();
    let selected = this.route.snapshot.queryParamMap.get('key') ?? undefined;
    this.dataSource = new MatTableDataSource<JgsNotification>([]);
    this.notificationsSubscription = this.notificationService.getList(this.userId).subscribe(
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
        if (this._selected != undefined) {
          selected = this._selected.data.key;
        }
        setTimeout(() => {
          this.initSelected(selected, new_data)
        }, 0)
      }
    );
  }

  private initSelected(selected: string | undefined, data: JgsNotification[]) {
    if (selected != undefined) {
      let found = data.find(f => f.data.key == selected);
      if (found) {
        this.onCurrentItemChanged(found)
      }
    }
  }
}
