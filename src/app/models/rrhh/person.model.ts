export interface PersonModel{
  id?: string;
  names?:string;
  lastNames?:string;
  identificationCode?:string;
  civilStatus?:string;
  gender?:string;
  birthdate?:Date;
  phone?:number;
  city?:string;
  profession?:string;
  typeContract?:string;
  isEnable: boolean;
}
export interface SelectPersonDto extends Partial<PersonModel> {
}

export interface UpdatePersonDto extends Partial<Omit<PersonModel, 'id'>> {
}
