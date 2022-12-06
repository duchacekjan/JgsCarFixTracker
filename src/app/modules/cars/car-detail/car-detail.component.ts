import {Component} from '@angular/core';
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";
import {Action} from "../../../models/action";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent extends BaseAfterNavigatedHandler {

  constructor(
    private readonly route: ActivatedRoute,
    navigation: NavigationService) {
    super(navigation);
  }

  protected override isMatch(data: any): boolean {
    return data?.startsWith('/cars/detail/') === true &&
      !(data?.startsWith('/cars/detail/edit') === true ||
        data?.startsWith('/cars/detail/new') === true)
  }

  protected override getActionsData(data: any): ActionsData {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(`route id: ${id}`);
    const editAction = new Action('edit_document');
    editAction.route = `/cars/detail/edit`;
    editAction.queryParams = {'id': id};
    editAction.color = 'accent';
    editAction.tooltip = 'toolbar.editCar';

    const removeAction = new Action('delete');
    removeAction.route = `/cars/detail/${id}`;
    removeAction.queryParams = {'action': 'delete'};
    removeAction.color = 'warn';
    removeAction.tooltip = 'toolbar.removeCar';
    const result = new ActionsData();
    result.actions = [removeAction, editAction];
    result.backAction = ActionsData.createBackAction('/cars');
    return result;
  }
}
