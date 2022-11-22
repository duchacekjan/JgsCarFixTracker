import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  toggleFormControls(
    form_group: FormGroup,
    control_list: string[],
    to_enable: boolean){
    let control_count = control_list.length;
    for(let i=0; i < control_count; i++){
      let current_control = form_group.get(control_list[i]);
      if(to_enable){
        current_control?.enable({emitEvent: false});
      }else{
        current_control?.disable({emitEvent: false});
      }
    }
  }
}
