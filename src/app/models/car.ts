import {Fix} from "./fix";

export class Car {
  key?: string | null;
  licencePlate: string = '';
  brand: string = '';
  model: string = '';
  fixes: Fix[] = [];
  stk?: Date;

  getLastMileage(): number {
    if (this.fixes.length === 0) {
      return 0;
    }
    return Math.max(...this.fixes.map(({mileage}) => mileage ? mileage : 0));
  }
}
