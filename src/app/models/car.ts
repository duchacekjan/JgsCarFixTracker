import { Fix } from "./fix";

export class Car {
    key?: string | null;
    licencePlate?: string;
    brand?: string = '';
    model?: string = '';
    fixes?: Fix[] = [];
}