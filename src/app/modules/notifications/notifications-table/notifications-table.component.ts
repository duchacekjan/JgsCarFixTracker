import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {JgsNotification} from "../../../models/INotification";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {NotificationsService} from "../../../services/notifications.service";
import {UserLocalConfigService} from "../../../services/user-local-config.service";
import {MessagesService} from "../../../services/messages.service";
import {HelperService} from "../../../services/helper.service";
import {ActivatedRoute} from "@angular/router";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";

@Component({
  selector: 'app-notifications-table',
  templateUrl: './notifications-table.component.html',
  styleUrls: ['./notifications-table.component.scss']
})
export class NotificationsTableComponent extends AfterNavigatedHandler implements OnInit, OnDestroy {
  @Input() isNewFn: (item: JgsNotification) => boolean = () => false;
  @Input() selection = new SelectionModel<JgsNotification>(true, [], true);
  @Input() currentItem?: JgsNotification;
  @Output() currentItemChange = new EventEmitter<JgsNotification | undefined>();
  displayedColumns: string[] = ['select', 'subject', 'created'];
  dataSource: MatTableDataSource<JgsNotification> = new MatTableDataSource<JgsNotification>([]);
  pageOptions = [5, 10, 20, 50];
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
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
  }

  protected override backLinkIfNotPresent = '/';
  protected override getActionsData(): ActionsData | null {
    const result = super.getDefaultActionsData();
    result.isNotificationsVisible = false;
    return result;
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
    this.selection.changed.subscribe(s => {
      if (s.source.selected.length > 1) {
        this.currentItem = undefined;
        this.currentItemChange.emit(undefined);
      }
    })
  }

  ngOnDestroy(): void {
    this.notificationsSubscription.unsubscribe();
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

  setCurrentNotification(notification: JgsNotification) {
    if (this.selection.selected.length > 1) {
      return;
    }
    this.selection.clear();
    if (this.currentItem?.data.key == notification.data.key) {
      this.currentItem = undefined;
    } else {
      this.currentItem = notification
      this.selection.select(notification)
    }
    console.log(this.currentItem)
    this.currentItemChange.emit(this.currentItem)
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
}
