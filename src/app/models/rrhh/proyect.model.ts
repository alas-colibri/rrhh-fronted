export interface ProyectModel {
  id: string;
  endDate: Date;
  isEnable: boolean;
  startDate: Date;
  nameProyect: string;
  descripcionProyect: string ;
  tipodeProyect: string ;
}

export interface CreateProyectDto extends Omit<ProyectModel, 'id'> {
}

export interface UpdateProyectDto extends Partial<Omit<ProyectModel, 'id'>> {
}

export interface ReadProyectDto extends Partial<ProyectModel> {
}

export interface SelectProyectDto extends Partial<ProyectModel> {
}
