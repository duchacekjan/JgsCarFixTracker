import { FixDto } from "./fix";

export class CarDto {
    key?: string | null;
    licencePlate?: string;
    brand?: string = '';
    model?: string = '';
    fixes?: FixDto[] = [];
}