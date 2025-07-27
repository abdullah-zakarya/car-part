export enum CarType {
  toyota = 'toyota',
  chevrolet = 'Chevrolet',
  tachometer = 'tachometer',
  ford = 'ford',
  kia = 'kia',
  audi = 'audi',
  volkswagen = 'volkswagen',
  mercedes = 'mercedes',
  subaru = 'subaru',
  porsche = 'porsche',
}
export enum Category {
  engine = 'engine',
  oilFilter = 'oil_filter',
  tachometer = 'tachometer',
  battery = 'battery',
  radiator = 'radiator',
  airFilter = 'air_filter',
  shockAbsorbers = 'shock_absorbers',
  steering = 'steering',
  struts = 'struts',
  motor = 'motor',
}
export interface filterFields {
  price?: [number, number];
  category?: Category[];
  status?: boolean;
  year?: number;
  carType?: CarType[];
  original?: boolean;
}
