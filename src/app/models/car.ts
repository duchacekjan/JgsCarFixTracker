export interface Car {
    licencePlate?: string;
    brand?: string;
    model?: string;
}

export interface CarDto extends Car {
    key?: string | null;
}