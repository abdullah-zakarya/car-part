export enum CarType {
  toyota = 'toyota',
  chevrolet = 'Chevrolet',
  tachometer = 'tachomerter',
  ford = 'ford',
  kia = 'kia',
  audi = 'audi',
  volkswagen = 'volkaswagen',
  mercedes = 'mercades',
  subaru = 'subaru',
  porsche = 'porsche',
}
export enum Catagory {
  engine = 'engine',
  oilFilter = 'oil_filter',
  tachometer = 'tachometer',
  battery = 'battery',
  radiator = 'radiator',
  airFilter = 'air_filter',
  shockAbsorbers = 'shock_absorbers',
  steering = 'steering',
  struts = 'struts',
}
export interface filterFields {
  price?: [number, number];
  catagory?: Catagory[];
  status?: boolean;
  year?: number;
  carType?: CarType[];
  orignal?: boolean;
}
