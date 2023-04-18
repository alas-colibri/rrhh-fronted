import { PersonModel } from "./person.model";
import { ProjectAssignmentModel } from "./projectAssignment";

export interface HolidayModel {
  id: string;
  person: PersonModel;
  cedula: string;
  observation: string;
  typeHoliday: string;
  startDate: Date;
  endDate: Date;
}

export interface CreateHolidayDto extends Omit<HolidayModel, 'id'> {
}

export interface UpdateHolidayDto extends Partial<Omit<HolidayModel, 'id'>> {
}

export interface ReadHolidayDto extends Partial<HolidayModel> {
}

export interface SelectHolidayDto extends Partial<HolidayModel> {
}
