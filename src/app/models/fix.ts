export interface Fix {
    carKey?: string,
    mileage?: number,
    lastUpdate?: Date,
    description?: string
}

export interface FixDto extends Fix {
    key?: string | null
}